package org.kaleta.dev;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Builds the in-memory database and fills it, once on every start: with the database dump in
 * dev-data/cookbookdb.sql when there is one, and with sample recipes and their pictures otherwise.
 * <p>
 * The tables come from sql/createTables.sql, so the development database cannot drift from the
 * schema. They are created here rather than by an INIT clause on the JDBC URL,
 * which H2 runs on every connection the pool opens. This class lives in src/dev/java, which only
 * the Maven "dev" profile adds to the build, so it is never part of a production artifact.
 */
@ApplicationScoped
public class DevDataInitializer
{
    private static final Logger LOG = Logger.getLogger(DevDataInitializer.class);

    private static final String PICTURES = "dev-images/";

    @Inject
    DataSource dataSource;

    /** A database dump to develop against instead of the sample recipes; its folder is git-ignored. */
    @ConfigProperty(name = "dev.data.dump", defaultValue = "dev-data/cookbookdb.sql")
    String dumpLocation;

    void onStart(@Observes StartupEvent event)
    {
        try (Connection connection = dataSource.getConnection(); Statement statement = connection.createStatement()) {
            statement.execute("RUNSCRIPT FROM 'sql/createTables.sql'");
            Path dump = Path.of(dumpLocation);
            if (Files.isRegularFile(dump)) {
                DumpImporter.Counts counts = DumpImporter.load(dump, connection);
                LOG.infof("Dev database loaded from the dump %s: %d recipes, %d steps, %d ingredients.",
                        dump, counts.recipes(), counts.steps(), counts.ingredients());
                return;
            }
            statement.execute("RUNSCRIPT FROM 'classpath:createDevDb.sql'");
            int pictures = attachPictures(connection);
            LOG.infof("Dev database created with sample recipes, %d of them with a picture.", pictures);
        } catch (SQLException | IOException e) {
            LOG.error("Failed to create the dev database.", e);
        }
    }

    /**
     * Gives the sample recipes the pictures dev-images/pictures.properties assigns them. They are
     * kept as plain JPEG files, shared between recipes of the same kind, rather than as base64
     * strings in the SQL.
     */
    private int attachPictures(Connection connection) throws IOException, SQLException
    {
        Properties assignments = new Properties();
        try (InputStream stream = resource(PICTURES + "pictures.properties")) {
            assignments.load(new InputStreamReader(stream, StandardCharsets.UTF_8));
        }

        Map<String, String> dataUrls = new HashMap<>();
        int attached = 0;
        try (PreparedStatement update = connection.prepareStatement("UPDATE Recipe SET image = ? WHERE id = ?")) {
            for (String recipeId : assignments.stringPropertyNames()) {
                String file = assignments.getProperty(recipeId).trim();
                String dataUrl = dataUrls.get(file);
                if (dataUrl == null) {
                    try (InputStream stream = resource(PICTURES + file)) {
                        dataUrl = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(stream.readAllBytes());
                    }
                    dataUrls.put(file, dataUrl);
                }
                update.setString(1, dataUrl);
                update.setLong(2, Long.parseLong(recipeId.trim()));
                attached += update.executeUpdate();
            }
        }
        return attached;
    }

    private static InputStream resource(String name) throws IOException
    {
        InputStream stream = Thread.currentThread().getContextClassLoader().getResourceAsStream(name);
        if (stream == null) throw new IOException("'" + name + "' is not on the classpath");
        return stream;
    }
}
