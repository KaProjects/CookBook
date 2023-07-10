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

    @Test
    public void getUserConfigs() {
        given().when()
                .get("/user/Viktorka/config")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("menuAnchor", is("left"))
                .body("recipeItemColor", not(nullValue()));

        given().when()
                .get("/user/Stanley/config")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("menuAnchor", is("right"))
                .body("recipeItemColor", not(nullValue()));
    }

    @Test
    public void getNonExistentUserConfigs() {
        String nonExistingUser = "xxxxxxxx";
        given().when()
                .get("/user/" + nonExistingUser + "/config")
                .then()
                .statusCode(404)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(containsString(nonExistingUser));
    }
}
