package org.kaleta.test;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class ListTest {

    @Test
    public void getMenuForCook(){
        String cook = "user";
        given().when()
                .get("/list/" + cook + "/menu")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("ingredients.size()", is(4))
                .body("ingredients", hasItem("Batatas"))
                .body("ingredients", hasItem("Fruitisimo"))
                .body("ingredients", hasItem("Kachnicka"))
                .body("ingredients", hasItem("Pomodoro"))
                .body("categories.size()", is(2))
                .body("categories", hasItem("Maso"))
                .body("categories", hasItem("Polievky"));
    }

    @Test
    public void getMenuForNonexistentCook(){
        String cook = "nonexistent";
        given().when()
                .get("/list/" + cook + "/menu")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("ingredients.size()", is(0))
                .body("categories.size()", is(0));
    }

    @Test
    public void getRecipesForCook() {
        String cook = "user";
        given().when()
                .get("/list/" + cook + "/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(3))
                .body("recipes[0].name", is("First Recipe"))
                .body("recipes[0].id", is("1"));
    }

    @Test
    public void getRecipesForNonexistentCook(){
        String cook = "nonexistent";
        given().when()
                .get("/list/" + cook + "/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(0));
    }

    @Test
    public void getRecipesForCookByCategory() {
        String cook = "user";
        String category = "Polievky";
        given().when()
                .get("/list/" + cook + "/recipe?category=" + category)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(2))
                .body("recipes[0].name", is("First Recipe"))
                .body("recipes[0].id", is("1"));
    }

    @Test
    public void getRecipesForCookByCategoryWithoutIngredients() {
        String cook = "user";
        String category = "Maso";
        given().when()
                .get("/list/" + cook + "/recipe?category=" + category)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(1))
                .body("recipes[0].name", is("Third Recipe"))
                .body("recipes[0].id", is("3"));
    }

    @Test
    public void getRecipesForCookByInvalidCategory() {
        String cook = "user";
        String category = "xxxxxxxxxx";
        given().when()
                .get("/list/" + cook + "/recipe?category=" + category)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(0));
    }

    @Test
    public void getRecipesForCookByIngredient() {
        String cook = "user";
        String ingredient = "Batatas";
        given().when()
                .get("/list/" + cook + "/recipe?ingredient=" + ingredient)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(2))
                .body("recipes[0].name", is("First Recipe"))
                .body("recipes[0].id", is("1"));
    }

    @Test
    public void getRecipesForCookByInvalidIngredient() {
        String cook = "user";
        String ingredient = "xxxxxxxxx";
        given().when()
                .get("/list/" + cook + "/recipe?ingredient=" + ingredient)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(0));
    }

    @Test
    public void getRecipesForCookByCategoryAndIngredient() {
        String cook = "user";
        String category = "Polievky";
        String ingredient = "Fruitisimo";
        given().when()
                .get("/list/" + cook + "/recipe?ingredient=" + ingredient + "&category=" + category)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(1))
                .body("recipes[0].name", is("Second Recipe"))
                .body("recipes[0].id", is("2"));
    }

    @Test
    public void getRecipesForCookByInvalidCategoryAndIngredient() {
        String cook = "user";
        String category = "xxxx";
        String ingredient = "yyyy";
        given().when()
                .get("/list/" + cook + "/recipe?ingredient=" + ingredient + "&category=" + category)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(0));
    }

    @Test
    public void getRecipesForCookByCategoryWithSpace() {
        String cook = "hellboy";
        String category = "Kuracie Maso";
        given().when()
                .get("/list/" + cook + "/recipe?category=" + category)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(1))
                .body("recipes[0].name", is("aaaa"))
                .body("recipes[0].id", is("5"));
    }

    @Test
    public void getRecipesForCookByIngredientWithSpace() {
        String cook = "hellboy";
        String ingredient = "Mucho Gusto";
        given().when()
                .get("/list/" + cook + "/recipe?ingredient=" + ingredient)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("recipes.size()", is(1))
                .body("recipes[0].name", is("aaaa"))
                .body("recipes[0].id", is("5"));
    }
}
