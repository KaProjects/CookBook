package org.kaleta.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Pins the JSON every read endpoint answers with on the test fixtures, so that a refactoring that
 * changes what the frontend receives - a field renamed, a null now written where it used to be
 * left out - fails here instead of in the browser.
 * <p>
 * After a change to an answer that is meant, record them again with
 * {@code ./mvnw test -Dtest=ResponseSnapshotTest -Dsnapshots.update=true} and review the
 * difference in the snapshot files before committing it.
 */
@QuarkusTest
class ResponseSnapshotTest
{
    private static final Path SNAPSHOTS = Path.of("src", "test", "resources", "snapshots");
    private static final ObjectMapper JSON = new ObjectMapper();

    @ParameterizedTest
    @ValueSource(strings = {
            "/user",
            "/user/user/config",
            "/user/user/menu",
            "/user/user/recipes",
            "/user/user3/recipes",
            "/recipe/1",
            "/recipe/2",
            "/recipe/3",
    })
    void answersAsRecorded(String path) throws IOException
    {
        String body = given().when().get(path).then().statusCode(200).extract().asString();
        Path snapshot = SNAPSHOTS.resolve(path.substring(1).replace('/', '_') + ".json");

        if (Boolean.getBoolean("snapshots.update")) {
            Files.createDirectories(SNAPSHOTS);
            Files.writeString(snapshot, JSON.writerWithDefaultPrettyPrinter().writeValueAsString(JSON.readTree(body)) + "\n");
            return;
        }
        if (!Files.exists(snapshot)) {
            fail("No snapshot of " + path + " - record it with -Dsnapshots.update=true");
        }

        JsonNode expected = JSON.readTree(Files.readString(snapshot));
        JsonNode actual = JSON.readTree(body);
        if (!expected.equals(actual)) {
            assertEquals(pretty(expected), pretty(actual), "the answer of " + path + " changed");
        }
    }

    private static String pretty(JsonNode node) throws IOException
    {
        return JSON.writerWithDefaultPrettyPrinter().writeValueAsString(node);
    }
}
