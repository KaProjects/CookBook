package org.kaleta;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.Header;
import io.restassured.response.Response;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.kaleta.dto.RecipeCreateDto;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RecipeTest {

    @Test
    @Order(1)
    public void getRecipe() {
        given().when()
                .get("/recipe/2")
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
    @Order(1)
    public void getNonexistentRecipe(){
        String invalidId = "22222";
        given().when()
                .get("/recipe/" + invalidId)
                .then()
                .statusCode(404)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(containsString(invalidId));
    }

    @Test
    @Order(1)
    public void getAllRecipes(){
        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(4)
    public void createRecipe(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();

        Response response = given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(201)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .extract().response();

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(5));

        given().when()
                .get("/recipe/" + response.getBody().asString())
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("name", is(dto.getName()))
                .body("category", is(dto.getCategory()))
                .body("image", is(dto.getImage()))
                .body("steps.size()", is(1))
                .body("steps[0].number", is(dto.getSteps().get(0).getNumber()))
                .body("steps[0].text", is(dto.getSteps().get(0).getText()))
                .body("steps[0].optional", is(dto.getSteps().get(0).isOptional()))
                .body("ingredients.size()", is(1))
                .body("ingredients[0].name", is(dto.getIngredients().get(0).getName()))
                .body("ingredients[0].quantity", is(dto.getIngredients().get(0).getQuantity()))
                .body("ingredients[0].optional", is(dto.getIngredients().get(0).isOptional()));
    }

    @Test
    @Order(5)
    public void createRecipeWithoutImage(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.setImage(null);

        Response response = given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(201)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .extract().response();

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(6));

        given().when()
                .get("/recipe/" + response.getBody().asString())
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("name", is(dto.getName()))
                .body("category", is(dto.getCategory()))
                .body("image", nullValue())
                .body("steps.size()", is(1))
                .body("steps[0].number", is(dto.getSteps().get(0).getNumber()))
                .body("steps[0].text", is(dto.getSteps().get(0).getText()))
                .body("steps[0].optional", is(dto.getSteps().get(0).isOptional()))
                .body("ingredients.size()", is(1))
                .body("ingredients[0].name", is(dto.getIngredients().get(0).getName()))
                .body("ingredients[0].quantity", is(dto.getIngredients().get(0).getQuantity()))
                .body("ingredients[0].optional", is(dto.getIngredients().get(0).isOptional()));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullName(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.setName(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Recipe.name"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullCategory(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.setCategory(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Recipe.category"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullCook(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.setCook(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Recipe.cook"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullStepNumber(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.getSteps().get(0).setNumber(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Step.number"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullStepText(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.getSteps().get(0).setText(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Step.text"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullIngredientName(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.getIngredients().get(0).setName(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Ingredient.name"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullIngredientQuantity(){
        RecipeCreateDto dto = TestHelper.createSampleRecipeCreateDto();
        dto.getIngredients().get(0).setQuantity(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .post("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Ingredient.quantity"));

        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(4));
    }

    @Test
    @Order(1)
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
    @Order(1)
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
}