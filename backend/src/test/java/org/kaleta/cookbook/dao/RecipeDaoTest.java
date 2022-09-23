package org.kaleta.cookbook.dao;

import com.sun.xml.bind.v2.TODO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@DataJpaTest
public class RecipeDaoTest {

    @Autowired private EntityManager entityManager;

    @Autowired private RecipeDao recipeDao;

    private Category categoryA;
    private Category categoryB;
    private Ingredient ingredientA;
    private Recipe recipeA;


    @Before
    public void before(){
        assertThat(entityManager).isNotNull();
        assertThat(recipeDao).isNotNull();

        categoryA = new Category();
        categoryA.setName("Category A");

        categoryB = new Category();
        categoryB.setName("Category B");

        ingredientA = new Ingredient();
        ingredientA.setName("Ingredient A");

        recipeA = new Recipe();
        recipeA.setName("Recipe A");
        recipeA.setCategory(categoryA);

        entityManager.persist(categoryA);
        entityManager.persist(categoryB);
        entityManager.persist(ingredientA);
        entityManager.persist(recipeA);
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void testCreateRecipeWithCategory(){
        Recipe recipe = new Recipe();
        recipe.setName("New Recipe");
        recipe.setCategory(categoryB);

        recipeDao.save(recipe);

        assertThat(entityManager.find(Recipe.class, recipe.getId()).getName()).isEqualTo(recipe.getName());
        assertThat(entityManager.find(Recipe.class, recipe.getId()).getCategory()).isEqualTo(categoryB);
        // TODO: bug1 - EntityNotFoundException: Unable to find
//        assertThat(entityManager.find(Category.class, categoryB.getId()).getRecipeSet()).contains(recipe).hasSize(1);
    }

    @Test
    public void testChangeCategory() {
        Recipe recipe = entityManager.find(Recipe.class, recipeA.getId());
        recipe.getCategory().getRecipeSet().remove(recipe);
        recipe.setCategory(categoryB);

        recipeDao.save(recipe);

        assertThat(entityManager.find(Recipe.class, recipe.getId()).getCategory()).isEqualTo(categoryB);
        assertThat(entityManager.find(Category.class, categoryA.getId()).getRecipeSet()).doesNotContain(recipe).hasSize(0);
        // TODO: bug1 - EntityNotFoundException: Unable to find
//        assertThat(entityManager.find(Category.class, categoryB.getId()).getRecipeSet()).contains(recipe).hasSize(1);
    }

    @Test
    public void testAddStep() {
        Step step = new Step();
        step.setNumber(1);
        step.setText("first step");
        step.setOptional(false);

        recipeA.addStep(step);

        recipeDao.save(recipeA);

        assertThat(entityManager.find(Recipe.class, recipeA.getId()).getStepList()).hasSize(1);
        assertThat(entityManager.find(Recipe.class, recipeA.getId()).getStepList().get(0)).isEqualTo(step);

        assertThat(entityManager.find(Step.class, step.getId())).isNotNull();
        assertThat(entityManager.find(Step.class, step.getId()).getParent()).isEqualTo(recipeA);
    }

    @Test
    public void testGetRecipeByName() {
        Recipe foundRecipe = recipeDao.getByName(recipeA.getName());

        assertThat(foundRecipe).isNotNull();
        assertThat(foundRecipe).isEqualTo(recipeA);
    }


    @Test
    public void testAddRecipeIngredient() {
        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setIngredient(ingredientA);
        recipeIngredient.setQuantity("100");
        recipeIngredient.setUnit("mg");
        recipeIngredient.setOptional(false);

        recipeA.addRecipeIngredient(recipeIngredient);

        recipeDao.save(recipeA);

        assertThat(entityManager.find(Recipe.class, recipeA.getId()).getRecipeIngredientList()).contains(recipeIngredient).hasSize(1);
        assertThat(entityManager.find(RecipeIngredient.class, recipeIngredient.getId()).getRecipe()).isEqualTo(recipeA);
        assertThat(entityManager.find(Ingredient.class, ingredientA.getId()).getRecipeIngredientSet()).contains(recipeIngredient).hasSize(1);
    }
}
