package org.kaleta.persistence;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.kaleta.dao.ListDao;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.RecipeListItem;
import org.kaleta.framework.Generator;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

/**
 * Runs against src/test/resources/createTestDb.sql. Cook "user" owns recipes
 * 1 (Polievky, one ingredient, one step), 2 (Polievky, image, four ingredients,
 * four steps) and 3 (Maso, nothing).
 */
@QuarkusTest
class ListDaoTest
{
    @Inject
    EntityManager entityManager;

    @Inject
    ListDao listDao;

    @Test
    void categories_areDistinctAndScopedToCook()
    {
        assertThat(listDao.categories("user"), containsInAnyOrder("Polievky", "Maso"));
        assertThat(listDao.categories("user2"), containsInAnyOrder("Polievky"));
        assertThat(listDao.categories("nobody"), is(empty()));
    }

    @Test
    void ingredients_areDistinctAndScopedToCook()
    {
        // Batatas appears in two of user's recipes but is listed once.
        assertThat(listDao.ingredients("user"), containsInAnyOrder("Pomodoro", "Batatas", "Fruitisimo", "Kachnicka"));
        assertThat(listDao.ingredients("user2"), containsInAnyOrder("Moloko"));
        assertThat(listDao.ingredients("nobody"), is(empty()));
    }

    @Test
    void recipes_withoutFilters_returnsEveryRecipeOnceWithFlags()
    {
        List<RecipeListItem> items = listDao.recipes("user", null, null);

        assertThat(items, hasSize(3));
        RecipeListItem first = find(items, "1");
        assertThat(first.getName(), is("First Recipe"));
        assertThat(first.getCategory(), is("Polievky"));
        assertThat(first.getHasImage(), is(false));
        assertThat(first.getHasSteps(), is(true));
        RecipeListItem second = find(items, "2");
        assertThat(second.getHasImage(), is(true));
        assertThat(second.getHasSteps(), is(true));
        RecipeListItem third = find(items, "3");
        assertThat(third.getCategory(), is("Maso"));
        assertThat(third.getHasImage(), is(false));
        assertThat(third.getHasSteps(), is(false));
    }

    @Test
    void recipes_byCategory_includesRecipesWithoutIngredients()
    {
        assertThat(ids(listDao.recipes("user", "Maso", null)), containsInAnyOrder("3"));
        assertThat(ids(listDao.recipes("user", "Polievky", null)), containsInAnyOrder("1", "2"));
        assertThat(listDao.recipes("user", "Unknown", null), is(empty()));
    }

    @Test
    void recipes_byIngredient_matchesExactName()
    {
        assertThat(ids(listDao.recipes("user", null, "Batatas")), containsInAnyOrder("1", "2"));
        assertThat(ids(listDao.recipes("user", null, "Pomodoro")), containsInAnyOrder("2"));
        assertThat(listDao.recipes("user", null, "Batata"), is(empty()));
    }

    @Test
    void recipes_byCategoryAndIngredient_combinesBoth()
    {
        assertThat(ids(listDao.recipes("user", "Polievky", "Pomodoro")), containsInAnyOrder("2"));
        assertThat(listDao.recipes("user", "Maso", "Pomodoro"), is(empty()));
    }

    @Test
    @TestTransaction
    void recipes_countsStepsOncePerRecipeEvenWithManyIngredients()
    {
        Recipe recipe = Generator.recipe("daoCook", "Stew", "Stews");
        Generator.ingredient(recipe, "Carrot", "2");
        Generator.ingredient(recipe, "Potato", "3");
        Generator.step(recipe, 1, "chop");
        Generator.step(recipe, 2, "boil");
        entityManager.persist(recipe);
        entityManager.flush();

        List<RecipeListItem> items = listDao.recipes("daoCook", null, null);

        assertThat(items, hasSize(1));
        assertThat(items.get(0).getHasSteps(), is(true));
        assertThat(items.get(0).getHasImage(), is(false));
    }

    private static RecipeListItem find(List<RecipeListItem> items, String id)
    {
        return items.stream().filter(item -> item.getId().equals(id)).findFirst().orElseThrow();
    }

    private static List<String> ids(List<RecipeListItem> items)
    {
        return items.stream().map(RecipeListItem::getId).toList();
    }
}
