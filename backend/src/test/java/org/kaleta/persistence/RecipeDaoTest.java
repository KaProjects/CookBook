package org.kaleta.persistence;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.kaleta.framework.Generator;
import org.kaleta.persistence.api.RecipeDao;
import org.kaleta.persistence.entity.Ingredient;
import org.kaleta.persistence.entity.Recipe;
import org.kaleta.persistence.entity.RecipeSummary;
import org.kaleta.persistence.entity.Step;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;

/** Runs against the fixtures in createTestDb.sql; writes are rolled back after each test. */
@QuarkusTest
class RecipeDaoTest
{
    @Inject
    EntityManager entityManager;

    @Inject
    RecipeDao recipeDao;

    @Test
    void find_loadsTheRecipeWithItsChildrenStepsInOrder()
    {
        Recipe recipe = recipeDao.find("2").orElseThrow();

        assertThat(recipe.getName(), is("Second Recipe"));
        assertThat(recipe.getSteps().stream().map(Step::getText).toList(), contains("Chop", "Fry", "Garnish", "Serve"));
        assertThat(recipe.getIngredients().stream().map(Ingredient::getName).toList(),
                containsInAnyOrder("Pomodoro", "Batatas", "Fruitisimo", "Kachnicka"));
    }

    @Test
    void find_isEmptyForAnUnknownId()
    {
        assertThat(recipeDao.find("missing").isEmpty(), is(true));
    }

    @Test
    void listCategoriesAndIngredients_areDistinctAndScopedToTheCook()
    {
        assertThat(recipeDao.listCategories("user"), containsInAnyOrder("Polievky", "Maso"));
        assertThat(recipeDao.listIngredients("user"), containsInAnyOrder("Pomodoro", "Batatas", "Fruitisimo", "Kachnicka"));
        assertThat(recipeDao.listCategories("user2"), contains("Polievky"));
        assertThat(recipeDao.listCategories("nobody"), is(empty()));
    }

    @Test
    void listSummaries_flagsImagesAndSteps()
    {
        assertThat(recipeDao.listSummaries("user", null, null), containsInAnyOrder(
                new RecipeSummary("1", "First Recipe", "Polievky", false, true),
                new RecipeSummary("2", "Second Recipe", "Polievky", true, true),
                new RecipeSummary("3", "Third Recipe", "Maso", false, false)));
    }

    @Test
    void listSummaries_filtersExactly()
    {
        assertThat(ids(recipeDao.listSummaries("user", "Maso", null)), contains("3"));
        assertThat(ids(recipeDao.listSummaries("user", null, "Batatas")), containsInAnyOrder("1", "2"));
        assertThat(ids(recipeDao.listSummaries("user", "Polievky", "Pomodoro")), contains("2"));
        assertThat(recipeDao.listSummaries("user", "Polie%", null), is(empty()));
    }

    @Test
    @TestTransaction
    void listSummaries_isOneRowPerRecipeHoweverManyChildren()
    {
        Recipe recipe = Generator.recipe("daoCook", "Stew", "Stews");
        Generator.ingredient(recipe, "Carrot", "2");
        Generator.ingredient(recipe, "Potato", "3");
        Generator.step(recipe, 1, "chop");
        Generator.step(recipe, 2, "boil");
        recipeDao.create(recipe);
        entityManager.flush();

        assertThat(recipeDao.listSummaries("daoCook", null, null),
                contains(new RecipeSummary(recipe.getId(), "Stew", "Stews", false, true)));
    }

    @Test
    @TestTransaction
    void create_cascadesToTheChildren()
    {
        Recipe recipe = Generator.recipe("daoCook", "Pancakes", "Breakfast");
        Generator.step(recipe, 1, "mix");
        Generator.ingredient(recipe, "Flour", "200 g");

        recipeDao.create(recipe);
        entityManager.flush();
        entityManager.clear();

        Recipe loaded = recipeDao.find(recipe.getId()).orElseThrow();
        assertThat(loaded.getSteps().stream().map(Step::getText).toList(), contains("mix"));
        assertThat(loaded.getIngredients().stream().map(Ingredient::getName).toList(), contains("Flour"));
    }

    @Test
    @TestTransaction
    void save_removesTheChildrenThatWereLeftOut()
    {
        Recipe recipe = Generator.recipe("daoCook", "Pancakes", "Breakfast");
        Generator.step(recipe, 1, "mix");
        Generator.ingredient(recipe, "Flour", "200 g");
        Generator.ingredient(recipe, "Milk", "300 ml");
        recipeDao.create(recipe);
        entityManager.flush();
        entityManager.clear();

        Recipe managed = recipeDao.find(recipe.getId()).orElseThrow();
        managed.setName("Crepes");
        managed.getSteps().clear();
        managed.getIngredients().clear();
        Generator.ingredient(managed, "Eggs", "2");
        recipeDao.save(managed);
        entityManager.flush();
        entityManager.clear();

        Recipe loaded = recipeDao.find(recipe.getId()).orElseThrow();
        assertThat(loaded.getName(), is("Crepes"));
        assertThat(loaded.getSteps(), is(empty()));
        assertThat(loaded.getIngredients().stream().map(Ingredient::getName).toList(), contains("Eggs"));
        assertThat(entityManager.createQuery("SELECT COUNT(i) FROM Ingredient i WHERE i.name IN ('Flour', 'Milk')", Long.class)
                .getSingleResult(), is(0L));
    }

    private static List<String> ids(List<RecipeSummary> summaries)
    {
        return summaries.stream().map(RecipeSummary::id).toList();
    }
}
