package org.kaleta;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class RecipeTest {

    @Test
    public void testGetRecipe() {
        given().when().get("/recipe/2")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("name", is("Second Recipe"))
                .body("category", is("Polievky"))
                .body("image", nullValue())
                .body("steps.size()", is(4))
                .body("steps[0].number", is(1))
                .body("steps[0].text", is("1 asd s"))
                .body("steps[0].optional", is(false))
                .body("ingredients.size()", is(4))
                .body("ingredients[0].name", is("Pomodoro"))
                .body("ingredients[0].quantity", is("4ks"))
                .body("ingredients[0].optional", is(false));
    }

    @Test
    public void testGetNonexistentRecipe(){
        String invalidId = "22222";
        given().when().get("/recipe/" + invalidId)
                .then()
                .statusCode(404)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(containsString(invalidId));
    }

    @Test
    public void testGetAllRecipes(){
        given().when().get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));

    }

}