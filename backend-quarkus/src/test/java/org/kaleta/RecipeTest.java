package org.kaleta;

import io.quarkus.test.junit.QuarkusTest;
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
                .body("name", is("Second Recipe"))
                .body("category", is("Polievky"))
                .body("image", nullValue())
                .body("stepList.size()", is(4))
                .body("stepList[0].number", is(1))
                .body("stepList[0].text", is("1 asd s"))
                .body("stepList[0].optional", is(false))
                .body("ingredientList.size()", is(4))
                .body("ingredientList[0].name", is("Pomodoro"))
                .body("ingredientList[0].quantity", is("4ks"))
                .body("ingredientList[0].optional", is(false));
    }

    @Test
    public void testGetNonexistentRecipe(){
        given().when().get("/recipe/222222")
                .then()
                .statusCode(500);
    }

}