package org.kaleta;

import io.quarkus.runtime.StartupEvent;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Builds the in-memory test database once, each time a test application starts: the tables from
 * the script production was created with, then the fixtures.
 * <p>
 * The tables used to be created by an INIT clause on the JDBC URL. H2 runs a URL's INIT on every
 * connection it opens, not once, and the table script starts by dropping every table: whenever
 * the pool opened another connection the database was rebuilt underneath the test.
 */
@ApplicationScoped
public class TestDatabase
{
    @Inject
    DataSource dataSource;

    @ConfigProperty(name = "test.database.fixture")
    String fixture;

    void onStart(@Observes @Priority(1) StartupEvent event) throws SQLException
    {
        try (Connection connection = dataSource.getConnection(); Statement statement = connection.createStatement()) {
            statement.execute("RUNSCRIPT FROM 'sql/createTables.sql'");
            statement.execute("RUNSCRIPT FROM '" + fixture + "'");
        }
    }
}
