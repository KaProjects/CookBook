package org.kaleta.test;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class UserTest {

    @Test
    public void getUsers() {
        given().when()
                .get("/user")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(2))
                .body("", hasItem("Stanley"))
                .body("", hasItem("Viktorka"));
    }

}
