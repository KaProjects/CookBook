package org.kaleta.test;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.Header;
import io.restassured.response.Response;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.dto.RecipeDto;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RecipeTest {

    private final Integer recipesNumber = 6;

    private RecipeCreateDto createSampleRecipeCreateDto() {
        RecipeCreateDto dto = new RecipeCreateDto();
        dto.setName("new Recipe");
        dto.setCategory("new Cat");
        dto.setCook("new User");
        dto.setImage("new Image");
        RecipeDto.StepDto stepDto = new RecipeDto.StepDto();
        stepDto.setNumber(1);
        stepDto.setText("a step");
        stepDto.setOptional(false);
        dto.getSteps().add(stepDto);
        RecipeDto.IngredientDto ingredientDto = new RecipeDto.IngredientDto();
        ingredientDto.setName("a ingredient");
        ingredientDto.setQuantity("4ks");
        ingredientDto.setOptional(true);
        dto.getIngredients().add(ingredientDto);
        return dto;
    }

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
                .body("image", any(String.class))
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
    public void getNonexistentRecipe() {
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
    public void getAllRecipes() {
        given().when()
                .get("/recipe")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(4)
    public void createRecipe() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();

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
                .body("size()", is(recipesNumber + 1));

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
    public void createRecipeWithoutImage() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber + 2));

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
    public void createRecipeWithNullName() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullCategory() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullCook() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullStepNumber() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullStepText() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullIngredientName() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void createRecipeWithNullIngredientQuantity() {
        RecipeCreateDto dto = createSampleRecipeCreateDto();
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
                .body("size()", is(recipesNumber));
    }

    @Test
    @Order(1)
    public void updateRecipeNoChange() {
        RecipeDto dto = given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .extract().response().as(RecipeDto.class);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .put("/recipe")
                .then()
                .statusCode(204);

        given().when()
                .get("/recipe/" + dto.getId())
                .then()
                .statusCode(200)
                .body("name", is(dto.getName()))
                .body("category", is(dto.getCategory()))
                .body("image", is(dto.getImage()))
                .body("steps.size()", is(dto.getSteps().size()))
                .body("steps[0].number", is(dto.getSteps().get(0).getNumber()))
                .body("steps[0].text", is(dto.getSteps().get(0).getText()))
                .body("steps[0].optional", is(dto.getSteps().get(0).isOptional()))
                .body("ingredients.size()", is(dto.getIngredients().size()))
                .body("ingredients[0].name", is(dto.getIngredients().get(0).getName()))
                .body("ingredients[0].quantity", is(dto.getIngredients().get(0).getQuantity()))
                .body("ingredients[0].optional", is(dto.getIngredients().get(0).isOptional()));
    }

    @Test
    @Order(3)
    public void updateRecipe() {
        RecipeDto dto = given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .extract().response().as(RecipeDto.class);

        dto.setName("new name");
        dto.setCategory("new cat");
        dto.setImage("an image");
        dto.getIngredients().get(0).setName("new name");
        RecipeDto.IngredientDto ingredientDto = new RecipeDto.IngredientDto();
        ingredientDto.setName("new ingred");
        ingredientDto.setQuantity("new q");
        dto.getIngredients().add(ingredientDto);
        dto.getSteps().clear();
        RecipeDto.StepDto stepDto = new RecipeDto.StepDto();
        stepDto.setText("new step");
        stepDto.setNumber(1);
        stepDto.setOptional(true);
        dto.getSteps().add(stepDto);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .put("/recipe")
                .then()
                .statusCode(204);

        given().when()
                .get("/recipe/" + dto.getId())
                .then()
                .statusCode(200)
                .body("name", is(dto.getName()))
                .body("category", is(dto.getCategory()))
                .body("image", is(dto.getImage()))
                .body("steps.size()", is(dto.getSteps().size()))
                .body("steps[0].number", is(dto.getSteps().get(0).getNumber()))
                .body("steps[0].text", is(dto.getSteps().get(0).getText()))
                .body("steps[0].optional", is(dto.getSteps().get(0).isOptional()))
                .body("ingredients.size()", is(dto.getIngredients().size()))
                .body("ingredients[0].name", is(dto.getIngredients().get(0).getName()))
                .body("ingredients[0].quantity", is(dto.getIngredients().get(0).getQuantity()))
                .body("ingredients[0].optional", is(dto.getIngredients().get(0).isOptional()))
                .body("ingredients[1].name", is(dto.getIngredients().get(1).getName()))
                .body("ingredients[1].quantity", is(dto.getIngredients().get(1).getQuantity()))
                .body("ingredients[1].optional", is(dto.getIngredients().get(1).isOptional()));
    }

    @Test
    @Order(2)
    public void updateRecipeNullId() {
        RecipeDto dto = given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .extract().response().as(RecipeDto.class);

        dto.setId(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .put("/recipe")
                .then()
                .statusCode(404)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(containsString("null"));
    }

    @Test
    @Order(2)
    public void updateRecipeNullName() {
        RecipeDto dto = given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .extract().response().as(RecipeDto.class);

        dto.setName(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .put("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Recipe.name"));
    }

    @Test
    @Order(2)
    public void updateRecipeNullCategory() {
        RecipeDto dto = given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .extract().response().as(RecipeDto.class);

        dto.setCategory(null);

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .put("/recipe")
                .then()
                .statusCode(400)
                .header("Content-Type", containsString(MediaType.TEXT_PLAIN))
                .body(is("not-null property references a null or transient value : org.kaleta.entity.Recipe.category"));
    }

    @Test
    @Order(4)
    public void updateRecipeRemoveStepsAndIngredients() {
        RecipeDto dto = given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .body("steps.size()", not(is(0)))
                .body("ingredients.size()", not(is(0)))
                .extract().response().as(RecipeDto.class);

        dto.getSteps().clear();
        dto.getIngredients().clear();

        given().when()
                .body(dto)
                .header(new Header("Content-Type", MediaType.APPLICATION_JSON))
                .put("/recipe")
                .then()
                .statusCode(204);

        given().when()
                .get("/recipe/6")
                .then()
                .statusCode(200)
                .header("Content-Type", containsString(MediaType.APPLICATION_JSON))
                .body("name", is(dto.getName()))
                .body("category", is(dto.getCategory()))
                .body("image", is(dto.getImage()))
                .body("steps.size()", is(0))
                .body("ingredients.size()", is(0));
    }
}