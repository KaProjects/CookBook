package org.kaleta.rest;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.kaleta.framework.Generator;
import org.kaleta.rest.dto.IngredientDto;
import org.kaleta.rest.dto.RecipeCreateDto;
import org.kaleta.rest.dto.RecipeDto;
import org.kaleta.rest.dto.RecipeUpdateDto;
import org.kaleta.rest.dto.StepDto;

import java.util.ArrayList;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.kaleta.framework.Problems.assertNotFound;
import static org.kaleta.framework.Problems.assertPostInvalid;
import static org.kaleta.framework.Problems.assertProblem;
import static org.kaleta.framework.Problems.assertPutInvalid;

/**
 * The recipe endpoints. Fixture recipes are only read; every test that writes creates a recipe
 * of its own for the user "writer", so no test depends on another having run.
 */
@QuarkusTest
class RecipeResourceTest
{
    private static final String COOK = "writer";

    private static RecipeDto create(RecipeCreateDto dto)
    {
        return given().contentType(ContentType.JSON).body(dto)
                .when().post("/recipe")
                .then().log().ifError().statusCode(201)
                .extract().as(RecipeDto.class);
    }

    private static RecipeDto update(String id, RecipeUpdateDto dto)
    {
        return given().contentType(ContentType.JSON).body(dto)
                .when().put("/recipe/" + id)
                .then().log().ifError().statusCode(200)
                .extract().as(RecipeDto.class);
    }

    private static RecipeDto get(String id)
    {
        return given().when().get("/recipe/" + id).then().statusCode(200).extract().as(RecipeDto.class);
    }

    private static RecipeUpdateDto editable(RecipeDto recipe)
    {
        RecipeUpdateDto dto = new RecipeUpdateDto();
        dto.setName(recipe.getName());
        dto.setCategory(recipe.getCategory());
        dto.setImage(recipe.getImage());
        dto.setSteps(new ArrayList<>(recipe.getSteps()));
        dto.setIngredients(new ArrayList<>(recipe.getIngredients()));
        return dto;
    }

    @Test
    void get_answersTheRecipeWithStepsInOrder()
    {
        given().when().get("/recipe/2").then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("id", is("2"))
                .body("cook", is("user"))
                .body("name", is("Second Recipe"))
                .body("category", is("Polievky"))
                .body("image", is("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2Q=="))
                .body("steps.number", contains(1, 2, 3, 4))
                .body("steps.text", contains("Chop", "Fry", "Garnish", "Serve"))
                .body("steps[2].optional", is(true))
                .body("ingredients", hasSize(4));
    }

    @Test
    void get_unknownRecipeIsNotFound()
    {
        assertNotFound("/recipe/does-not-exist").body("detail", is("Recipe 'does-not-exist' does not exist."));
    }

    @Test
    void get_malformedIdIsInvalid()
    {
        assertProblem(given().when().get("/recipe/not an id!").then(), 400, "Bad Request")
                .body("violations[0].field", is("id"));
    }

    @Test
    void create_persistsTheRecipeAndAnswersIt()
    {
        RecipeCreateDto dto = Generator.createDto(COOK);
        dto.setName("  Trimmed name  ");

        RecipeDto created = create(dto);

        assertThat(created.getId(), is(notNullValue()));
        assertThat(created.getCook(), is(COOK));
        assertThat(created.getName(), is("Trimmed name"));
        assertThat(created.getImage(), is(nullValue()));
        RecipeDto stored = get(created.getId());
        assertThat(stored.getName(), is("Trimmed name"));
        assertThat(stored.getSteps(), is(dto.getSteps()));
        assertThat(stored.getIngredients(), is(dto.getIngredients()));
    }

    @Test
    void create_renumbersStepsInTheirOrder()
    {
        RecipeCreateDto dto = Generator.createDto(COOK);
        dto.setSteps(List.of(new StepDto(10, "last", false), new StepDto(3, "first", false), new StepDto(7, "middle", true)));

        RecipeDto created = create(dto);

        assertThat(created.getSteps().stream().map(StepDto::getText).toList(), contains("first", "middle", "last"));
        assertThat(created.getSteps().stream().map(StepDto::getNumber).toList(), contains(1, 2, 3));
    }

    @Test
    void create_storesTheImageAsJpeg()
    {
        RecipeCreateDto dto = Generator.createDto(COOK);
        dto.setImage(Generator.image("png", 120, 80));

        RecipeDto created = create(dto);

        assertThat(Generator.isJpeg(created.getImage()), is(true));
        assertThat(Generator.decode(get(created.getId()).getImage()).getWidth(), is(120));
    }

    @Test
    void create_refusesAnImageThatIsNotAPicture()
    {
        RecipeCreateDto dto = Generator.createDto(COOK);
        dto.setImage("data:image/png;base64,aGVsbG8=");

        assertProblem(given().contentType(ContentType.JSON).body(dto).when().post("/recipe").then(), 400, "Bad Request")
                .body("detail", is("The image is not a picture in a supported format."));
    }

    @Test
    void create_validatesTheRecipe()
    {
        RecipeCreateDto dto = Generator.createDto(COOK);
        dto.setCook("nobody");
        assertPostInvalid("/recipe", dto, "cook", "must be a known user");

        dto = Generator.createDto(COOK);
        dto.setName(" ");
        assertPostInvalid("/recipe", dto, "name", "must not be blank");

        dto = Generator.createDto(COOK);
        dto.setCategory("x".repeat(101));
        assertPostInvalid("/recipe", dto, "category", "size must be between 0 and 100");

        dto = Generator.createDto(COOK);
        dto.setImage("not a data url");
        assertPostInvalid("/recipe", dto, "image", "must be a base64 image data URL");

        dto = Generator.createDto(COOK);
        dto.getSteps().set(1, new StepDto(0, "", false));
        assertPostInvalid("/recipe", dto, "steps[1].number", "must be greater than 0");
        assertPostInvalid("/recipe", dto, "steps[1].text", "must not be blank");

        dto = Generator.createDto(COOK);
        dto.getIngredients().set(0, new IngredientDto("Salt", "x".repeat(31), false));
        assertPostInvalid("/recipe", dto, "ingredients[0].quantity", "size must be between 0 and 30");

        dto = Generator.createDto(COOK);
        dto.getIngredients().add(null);
        assertPostInvalid("/recipe", dto, "ingredients[2]", "must not be null");
    }

    @Test
    void create_withoutABodyIsInvalid()
    {
        assertProblem(given().contentType(ContentType.JSON).when().post("/recipe").then(), 400, "Bad Request");
    }

    @Test
    void update_replacesEverythingEditable()
    {
        RecipeDto recipe = create(Generator.createDto(COOK));
        RecipeUpdateDto dto = editable(recipe);
        dto.setName("Renamed");
        dto.setCategory("Moved");
        dto.setSteps(List.of(new StepDto(1, "only step", true)));
        dto.setIngredients(List.of(new IngredientDto("Sugar", "1 kg", false)));

        RecipeDto updated = update(recipe.getId(), dto);

        assertThat(updated.getId(), is(recipe.getId()));
        assertThat(updated.getCook(), is(COOK));
        RecipeDto stored = get(recipe.getId());
        assertThat(stored.getName(), is("Renamed"));
        assertThat(stored.getCategory(), is("Moved"));
        assertThat(stored.getSteps(), is(List.of(new StepDto(1, "only step", true))));
        assertThat(stored.getIngredients(), is(List.of(new IngredientDto("Sugar", "1 kg", false))));
    }

    @Test
    void update_canRemoveEveryStepAndIngredient()
    {
        RecipeDto recipe = create(Generator.createDto(COOK));
        RecipeUpdateDto dto = editable(recipe);
        dto.setSteps(List.of());
        dto.setIngredients(List.of());

        update(recipe.getId(), dto);

        RecipeDto stored = get(recipe.getId());
        assertThat(stored.getSteps(), hasSize(0));
        assertThat(stored.getIngredients(), hasSize(0));
    }

    @Test
    void update_keepsAnUnchangedImageAsItIs()
    {
        RecipeCreateDto create = Generator.createDto(COOK);
        create.setImage(Generator.image("png", 64, 64));
        RecipeDto recipe = create(create);

        RecipeUpdateDto dto = editable(recipe);
        dto.setName("Renamed");
        RecipeDto updated = update(recipe.getId(), dto);

        assertThat(updated.getImage(), is(recipe.getImage()));
    }

    @Test
    void update_replacesAndRemovesTheImage()
    {
        RecipeDto recipe = create(Generator.createDto(COOK));
        RecipeUpdateDto dto = editable(recipe);

        dto.setImage(Generator.image("jpg", 32, 32));
        String replaced = update(recipe.getId(), dto).getImage();
        assertThat(Generator.isJpeg(replaced), is(true));
        assertThat(replaced, is(not(dto.getImage())));

        dto.setImage(null);
        assertThat(update(recipe.getId(), dto).getImage(), is(nullValue()));
    }

    @Test
    void update_unknownRecipeIsNotFound()
    {
        assertProblem(given().contentType(ContentType.JSON).body(Generator.updateDto())
                .when().put("/recipe/does-not-exist").then(), 404, "Not Found");
    }

    @Test
    void update_validatesTheRecipe()
    {
        RecipeUpdateDto dto = Generator.updateDto();
        dto.setName(null);
        assertPutInvalid("/recipe/1", dto, "name", "must not be blank");

        dto = Generator.updateDto();
        dto.setSteps(null);
        assertPutInvalid("/recipe/1", dto, "steps", "must not be null");
    }
}
