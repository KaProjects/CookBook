package org.kaleta.persistence;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import org.junit.jupiter.api.Test;
import org.kaleta.dao.RecipeDao;
import org.kaleta.entity.Ingredient;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.Step;
import org.kaleta.framework.Generator;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertThrows;

@QuarkusTest
class RecipeDaoTest
{
    @Inject
    EntityManager entityManager;

    @Inject
    RecipeDao recipeDao;

    @Test
    void get_loadsRecipeWithChildren()
    {
        Recipe recipe = recipeDao.get("2");

        assertThat(recipe.getName(), is("Second Recipe"));
        assertThat(recipe.getCook(), is("user"));
        assertThat(recipe.getImage(), is(notNullValue()));
        assertThat(recipe.getSteps(), hasSize(4));
        assertThat(recipe.getIngredients(), hasSize(4));
    }

    @Test
    void get_throwsWhenMissing()
    {
        assertThrows(NoResultException.class, () -> recipeDao.get("missing"));
    }

    @Test
    void getList_returnsAllCooks()
    {
        assertThat(recipeDao.getList().stream().map(Recipe::getCook).distinct().toList(),
                org.hamcrest.Matchers.hasItems("user", "user2", "hellboy"));
    }

    @Test
    @TestTransaction
    void create_cascadesStepsAndIngredients()
    {
        Recipe recipe = Generator.recipe("daoCook", "Pancakes", "Breakfast");
        Generator.step(recipe, 1, "mix");
        Generator.ingredient(recipe, "Flour", "200g");

        String id = recipeDao.create(recipe);
        entityManager.flush();
        entityManager.clear();

        Recipe loaded = recipeDao.get(id);
        assertThat(id, is(recipe.getId()));
        assertThat(loaded.getSteps().stream().map(Step::getText).toList(), contains("mix"));
        assertThat(loaded.getIngredients().stream().map(Ingredient::getName).toList(), contains("Flour"));
    }

    @Test
    @TestTransaction
    void update_replacesStepsAndIngredients()
    {
        Recipe recipe = Generator.recipe("daoCook", "Pancakes", "Breakfast");
        Generator.step(recipe, 1, "mix");
        Generator.ingredient(recipe, "Flour", "200g");
        Generator.ingredient(recipe, "Milk", "300ml");
        String id = recipeDao.create(recipe);
        entityManager.flush();
        entityManager.clear();

        Recipe changed = Generator.recipe("daoCook", "Crepes", "Dessert");
        changed.setId(id);
        Generator.step(changed, 1, "whisk");
        Generator.step(changed, 2, "fry");
        Generator.ingredient(changed, "Eggs", "2");
        recipeDao.update(changed);
        entityManager.flush();
        entityManager.clear();

        Recipe loaded = recipeDao.get(id);
        assertThat(loaded.getName(), is("Crepes"));
        assertThat(loaded.getCategory(), is("Dessert"));
        assertThat(loaded.getSteps().stream().map(Step::getText).toList(), containsInAnyOrder("whisk", "fry"));
        assertThat(loaded.getIngredients().stream().map(Ingredient::getName).toList(), contains("Eggs"));
        Long orphans = entityManager.createQuery("SELECT count(i) FROM Ingredient i WHERE i.name IN ('Flour', 'Milk')", Long.class)
                .getSingleResult();
        assertThat(orphans, is(0L));
    }
}
