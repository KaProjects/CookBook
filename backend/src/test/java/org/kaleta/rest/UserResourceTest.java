package org.kaleta.rest;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.kaleta.framework.Problems.assertNotFound;
import static org.kaleta.framework.Problems.assertProblem;

/** The users, their settings, and the menu and recipe list of each, on the fixtures. */
@QuarkusTest
class UserResourceTest
{
    @Test
    void getUsers_listsTheConfiguredUsers()
    {
        given().when().get("/user").then()
                .statusCode(200)
                .body("$", contains("user", "user2", "user3", "writer"));
    }

    @Test
    void getConfig_answersTheUsersLayout()
    {
        given().when().get("/user/user/config").then()
                .statusCode(200)
                .body("menuAnchor", is("right"))
                .body("recipeItemColor", is("rgb(255,229,103)"));
    }

    @Test
    void unknownUsersAreNotFound()
    {
        assertNotFound("/user/nobody/config").body("detail", is("User 'nobody' does not exist."));
        assertNotFound("/user/nobody/menu");
        assertNotFound("/user/nobody/recipes");
    }

    @Test
    void getMenu_listsCategoriesAndIngredientsAlphabetically()
    {
        given().when().get("/user/user/menu").then()
                .statusCode(200)
                .body("categories", contains("Maso", "Polievky"))
                .body("ingredients", contains("Batatas", "Fruitisimo", "Kachnicka", "Pomodoro"));
    }

    @Test
    void getMenu_isScopedToTheUser()
    {
        given().when().get("/user/user2/menu").then()
                .statusCode(200)
                .body("categories", contains("Polievky"))
                .body("ingredients", contains("Moloko"));
    }

    @Test
    void getRecipes_groupsByCategoryAlphabetically()
    {
        given().when().get("/user/user/recipes").then()
                .statusCode(200)
                .body("categories.name", contains("Maso", "Polievky"))
                .body("categories[0].recipes.name", contains("Third Recipe"))
                .body("categories[0].recipes[0].hasImage", is(false))
                .body("categories[0].recipes[0].hasSteps", is(false))
                .body("categories[1].recipes.name", contains("First Recipe", "Second Recipe"))
                .body("categories[1].recipes[1].id", is("2"))
                .body("categories[1].recipes[1].hasImage", is(true))
                .body("categories[1].recipes[1].hasSteps", is(true));
    }

    @Test
    void getRecipes_filtersByCategory()
    {
        given().queryParam("category", "Polievky").when().get("/user/user/recipes").then()
                .statusCode(200)
                .body("categories.name", contains("Polievky"))
                .body("categories[0].recipes.id", contains("1", "2"));
    }

    @Test
    void getRecipes_filtersByCategoryWithSpaces()
    {
        given().queryParam("category", "Kuracie Maso").when().get("/user/user3/recipes").then()
                .statusCode(200)
                .body("categories[0].recipes.id", contains("5"));
    }

    @Test
    void getRecipes_filtersByIngredient()
    {
        given().queryParam("ingredient", "Batatas").when().get("/user/user/recipes").then()
                .statusCode(200)
                .body("categories.name", contains("Polievky"))
                .body("categories[0].recipes.id", contains("1", "2"));
        given().queryParam("ingredient", "Pomodoro").when().get("/user/user/recipes").then()
                .body("categories[0].recipes.id", contains("2"));
    }

    @Test
    void getRecipes_filtersByCategoryAndIngredient()
    {
        given().queryParam("category", "Polievky").queryParam("ingredient", "Pomodoro")
                .when().get("/user/user/recipes").then()
                .body("categories", hasSize(1))
                .body("categories[0].recipes.id", contains("2"));
        given().queryParam("category", "Maso").queryParam("ingredient", "Pomodoro")
                .when().get("/user/user/recipes").then()
                .body("categories", is(empty()));
    }

    @Test
    void getRecipes_filtersAreExactNotPatterns()
    {
        given().queryParam("category", "%").when().get("/user/user/recipes").then()
                .statusCode(200)
                .body("categories", is(empty()));
        given().queryParam("ingredient", "Bata%").when().get("/user/user/recipes").then()
                .body("categories", is(empty()));
    }

    @Test
    void getRecipes_validatesTheFilters()
    {
        assertProblem(given().queryParam("category", "x".repeat(101)).when().get("/user/user/recipes").then(), 400, "Bad Request")
                .body("violations[0].field", is("category"));
    }
}
