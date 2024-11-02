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
                .body("size()", is(3))
                .body("", hasItem("user"))
                .body("", hasItem("user2"))
                .body("", hasItem("user3"));
    }

    @Test
    public void getUserConfigs() {
        given().when()
                .get("/user/user2/config")
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
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("menuAnchor", is(not(nullValue())))
                .body("recipeItemColor", is(not(nullValue())));
    }
}
