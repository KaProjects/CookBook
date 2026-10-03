package org.kaleta.dev;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Builds the in-memory database and fills it with sample recipes, once on every start.
 * <p>
 * The tables come from the same script production was created with, so the development database
 * cannot drift from it. They are created here rather than by an INIT clause on the JDBC URL,
 * which H2 runs on every connection the pool opens. This class lives in src/dev/java, which only
 * the Maven "dev" profile adds to the build, so it is never part of a production artifact.
 */
@ApplicationScoped
public class DevDataInitializer
{
    private static final Logger LOG = Logger.getLogger(DevDataInitializer.class);

    @Inject
    DataSource dataSource;

    void onStart(@Observes StartupEvent event)
    {
        try (Connection connection = dataSource.getConnection(); Statement statement = connection.createStatement()) {
            statement.execute("RUNSCRIPT FROM 'sql/createTables.sql'");
            statement.execute("RUNSCRIPT FROM 'classpath:createDevDb.sql'");
            LOG.info("Dev database created with sample recipes.");
        } catch (SQLException e) {
            LOG.error("Failed to create the dev database.", e);
        }
    }
}
