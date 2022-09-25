package org.kaleta.cookbook.service;

import org.junit.Before;
import org.junit.Test;
import org.kaleta.cookbook.dao.RecipeDao;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.Recipe;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.*;

public class RecipeServiceTest {

    @Mock
    private RecipeDao recipeDao;

    @InjectMocks
    private RecipeService recipeService = new RecipeServiceImpl();

    private Category categoryA;
    private Category categoryB;
    private Recipe recipeA;
    private Recipe recipeB;

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);

        categoryA = new Category();
        categoryA.setName("Category A");

        categoryB = new Category();
        categoryB.setName("Category B");

        recipeA = new Recipe();
        recipeA.setName("Recipe A");
        recipeA.setCategory(categoryA);

        recipeB = new Recipe();
        recipeB.setName("Recipe B");
        recipeB.setCategory(categoryA);
    }

    @Test
    public void listAllRecipes() {
        when(recipeDao.findAll()).thenReturn(List.of(recipeA, recipeB));

        List<Recipe> result = recipeService.listAllRecipes();

        assertThat(result).hasSize(2);
        verify(recipeDao, times(1)).findAll();

    }

    @Test
    public void listRecipesByCategory() {
        fail("not implemented");
    }

    @Test
    public void listRecipesByIngredient() {
        fail("not implemented");
    }

    @Test
    public void createRecipe() {
        fail("not implemented");
    }

    @Test
    public void removeRecipes() {
        fail("not implemented");
    }

    @Test
    public void getRecipeList() {
        fail("not implemented");
    }

    @Test
    public void getIngredientRecipeList() {
        fail("not implemented");
    }

    @Test
    public void getCategoryRecipeList() {
        fail("not implemented");
    }

    @Test
    public void getRecipe() {
        fail("not implemented");
    }

    @Test
    public void deleteRecipe() {
        fail("not implemented");
    }

    @Test
    public void updateRecipe() {
        fail("not implemented");
    }
}