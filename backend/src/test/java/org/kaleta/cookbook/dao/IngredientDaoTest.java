package org.kaleta.cookbook.dao;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.entity.RecipeIngredient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
public class IngredientDaoTest {

    @Autowired private EntityManager entityManager;

    @Autowired private IngredientDao ingredientDao;

    private Ingredient ingredientA;
    private RecipeIngredient recipeIngredientA;
    private Recipe recipeA;


    @Before
    public void before(){
        assertThat(entityManager).isNotNull();
        assertThat(ingredientDao).isNotNull();

        Category categoryA = new Category();
        categoryA.setName("Category A");
        entityManager.persist(categoryA);

        ingredientA = new Ingredient();
        ingredientA.setName("Ingredient A");
        entityManager.persist(ingredientA);

        recipeIngredientA = new RecipeIngredient();
        recipeIngredientA.setQuantity(100);
        recipeIngredientA.setUnit("mg");
        recipeIngredientA.setOptional(false);
        recipeIngredientA.setIngredient(ingredientA);
        entityManager.persist(recipeIngredientA);

        recipeA = new Recipe();
        recipeA.setName("Recipe A");
        recipeA.setCategory(categoryA);
        recipeA.addRecipeIngredient(recipeIngredientA);
        entityManager.persist(recipeA);


        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void testCreateIngredient() {
        Ingredient ingredient = new Ingredient();
        ingredient.setName("New Ingredient");

        ingredientDao.save(ingredient);

        Ingredient foundIngredient = entityManager.find(Ingredient.class, ingredient.getId());
        assertThat(foundIngredient).isNotNull();
    }

    @Test
    public void testGetIngredientRecipes() {
        Set<Recipe> recipeSet = ingredientDao.getIngredientRecipes(ingredientA.getId());

        assertThat(recipeSet).contains(recipeA).hasSize(1);
        assertThat(recipeSet.iterator().next().getRecipeIngredientList()).contains(recipeIngredientA).hasSize(1);
        assertThat(recipeSet.iterator().next().getRecipeIngredientList().get(0).getIngredient()).isEqualTo(ingredientA);
    }
}
