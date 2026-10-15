package org.kaleta.dev;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Loads the recipes, steps and ingredients of a mariadb-dump into the development database, which
 * the table script has just created.
 * <p>
 * Only those three tables are read; anything else the dump holds is skipped. Their column order
 * is taken from the dump's own CREATE TABLE statements. The rows are numbered afresh, recipes by
 * cook and name and their steps and ingredients in the order they belong to them, as the 2.1 to
 * 2.2 migration numbers them - so a dump of the 2.1 schema, with UUID IDs, loads as well as one of
 * 2.2.
 */
final class DumpImporter
{
    private static final Pattern CREATE_TABLE = Pattern.compile("^CREATE TABLE `(\\w+)` \\(");
    private static final Pattern COLUMN = Pattern.compile("^\\s+`(\\w+)` ");
    private static final Pattern INSERT = Pattern.compile("^INSERT INTO `(\\w+)` VALUES\\s*");
    private static final List<String> TABLES = List.of("Recipe", "Step", "Ingredient");

    private final Map<String, List<String>> columns = new HashMap<>();
    private final Map<String, List<Map<String, Object>>> rows = new HashMap<>();

    record Counts(int recipes, int steps, int ingredients) {}

    static Counts load(Path dump, Connection connection) throws IOException, SQLException
    {
        DumpImporter importer = new DumpImporter();
        importer.read(dump);
        return importer.write(connection);
    }

    private void read(Path dump) throws IOException
    {
        String table = null;
        try (BufferedReader reader = Files.newBufferedReader(dump, StandardCharsets.UTF_8)) {
            for (String line = reader.readLine(); line != null; line = reader.readLine()) {
                Matcher create = CREATE_TABLE.matcher(line);
                if (create.find()) {
                    table = create.group(1);
                    columns.put(table, new ArrayList<>());
                    continue;
                }
                if (table != null) {
                    Matcher column = COLUMN.matcher(line);
                    if (column.find()) {
                        columns.get(table).add(column.group(1));
                        continue;
                    }
                    if (line.startsWith(")")) table = null;
                }
                Matcher insert = INSERT.matcher(line);
                if (insert.find() && TABLES.contains(insert.group(1))) {
                    String name = insert.group(1);
                    List<String> names = columns.get(name);
                    if (names == null) throw new IOException("INSERT into " + name + " before its CREATE TABLE");
                    // mariadb-dump puts each row of the statement on a line of its own. A string
                    // never spans lines - its line breaks are escaped - so the statement ends at
                    // the first line that ends it.
                    StringBuilder statement = new StringBuilder(line);
                    while (!statement.toString().stripTrailing().endsWith(";")) {
                        String next = reader.readLine();
                        if (next == null) throw new IOException("The dump ends inside an INSERT into " + name);
                        statement.append(next);
                    }
                    for (List<Object> values : tuples(statement.toString(), insert.end())) {
                        Map<String, Object> row = new LinkedHashMap<>();
                        for (int i = 0; i < names.size(); i++) row.put(names.get(i), values.get(i));
                        rows.computeIfAbsent(name, key -> new ArrayList<>()).add(row);
                    }
                }
            }
        }
    }

    /** The value tuples of one INSERT line: strings with MySQL's backslash escapes, numbers, NULL. */
    static List<List<Object>> tuples(String line, int start)
    {
        List<List<Object>> tuples = new ArrayList<>();
        int i = start;
        while (i < line.length()) {
            char c = line.charAt(i);
            if (c != '(') {
                i++;
                continue;
            }
            List<Object> values = new ArrayList<>();
            i++;
            while (true) {
                c = line.charAt(i);
                if (c == '\'') {
                    StringBuilder value = new StringBuilder();
                    i++;
                    while (true) {
                        c = line.charAt(i);
                        if (c == '\\') {
                            char escaped = line.charAt(i + 1);
                            value.append(switch (escaped) {
                                case 'n' -> '\n';
                                case 'r' -> '\r';
                                case 't' -> '\t';
                                case '0' -> '\0';
                                case 'Z' -> (char) 26;
                                default -> escaped;
                            });
                            i += 2;
                        } else if (c == '\'') {
                            if (i + 1 < line.length() && line.charAt(i + 1) == '\'') {
                                value.append('\'');
                                i += 2;
                            } else {
                                i++;
                                break;
                            }
                        } else {
                            value.append(c);
                            i++;
                        }
                    }
                    values.add(value.toString());
                } else {
                    int end = i;
                    while (line.charAt(end) != ',' && line.charAt(end) != ')') end++;
                    String literal = line.substring(i, end).trim();
                    values.add(literal.equalsIgnoreCase("NULL") ? null : literal);
                    i = end;
                }
                c = line.charAt(i);
                i++;
                if (c == ')') break;
            }
            tuples.add(values);
        }
        return tuples;
    }

    private Counts write(Connection connection) throws SQLException
    {
        List<Map<String, Object>> recipes = new ArrayList<>(rows.getOrDefault("Recipe", List.of()));
        recipes.sort(Comparator.comparing((Map<String, Object> row) -> text(row, "cook"))
                .thenComparing(row -> text(row, "name"))
                .thenComparing(row -> text(row, "id")));
        Map<String, Long> recipeIds = new HashMap<>();
        try (PreparedStatement insert = connection.prepareStatement(
                "INSERT INTO Recipe (id, cook, name, category, image) VALUES (?, ?, ?, ?, ?)")) {
            for (Map<String, Object> row : recipes) {
                long id = recipeIds.size() + 1L;
                recipeIds.put(text(row, "id"), id);
                insert.setLong(1, id);
                insert.setString(2, text(row, "cook"));
                insert.setString(3, text(row, "name"));
                insert.setString(4, text(row, "category"));
                insert.setString(5, (String) row.get("image"));
                insert.addBatch();
            }
            insert.executeBatch();
        }

        int steps = children(connection, "Step", recipeIds, "number",
                "INSERT INTO Step (id, text, number, optional, recipeId) VALUES (?, ?, ?, ?, ?)",
                (insert, row) -> {
                    insert.setString(2, text(row, "text"));
                    insert.setInt(3, Integer.parseInt(text(row, "number")));
                    insert.setBoolean(4, flag(row));
                });
        int ingredients = children(connection, "Ingredient", recipeIds, "id",
                "INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES (?, ?, ?, ?, ?)",
                (insert, row) -> {
                    insert.setString(2, text(row, "name"));
                    insert.setString(3, text(row, "quantity"));
                    insert.setBoolean(4, flag(row));
                });
        return new Counts(recipes.size(), steps, ingredients);
    }

    private interface Fill
    {
        void fill(PreparedStatement insert, Map<String, Object> row) throws SQLException;
    }

    /** Rows of a recipe that is not in the dump are left out, as the migration refuses them. */
    private int children(Connection connection, String table, Map<String, Long> recipeIds, String order,
                         String sql, Fill fill) throws SQLException
    {
        List<Map<String, Object>> children = rows.getOrDefault(table, List.of()).stream()
                .filter(row -> recipeIds.containsKey(text(row, "recipeId")))
                .sorted(Comparator.comparing((Map<String, Object> row) -> recipeIds.get(text(row, "recipeId")))
                        .thenComparing(row -> order.equals("number") ? String.format("%05d", Integer.parseInt(text(row, order))) : text(row, order)))
                .toList();
        try (PreparedStatement insert = connection.prepareStatement(sql)) {
            long id = 1;
            for (Map<String, Object> row : children) {
                insert.setLong(1, id++);
                fill.fill(insert, row);
                insert.setLong(5, recipeIds.get(text(row, "recipeId")));
                insert.addBatch();
            }
            insert.executeBatch();
        }
        return children.size();
    }

    private static String text(Map<String, Object> row, String column)
    {
        Object value = row.get(column);
        return value == null ? "" : value.toString();
    }

    /** A missing optional flag is false, as the migration copied it. */
    private static boolean flag(Map<String, Object> row)
    {
        String value = text(row, "optional");
        return value.equals("1") || value.equalsIgnoreCase("true");
    }
}
