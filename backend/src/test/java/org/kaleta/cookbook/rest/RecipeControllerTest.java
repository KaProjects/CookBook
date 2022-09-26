package org.kaleta.cookbook.rest;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.dto.CategoryDto;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.entity.RecipeIngredient;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.fail;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(RecipeController.class)
public class RecipeControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    RecipeService recipeService;

    @MockBean
    MappingService mappingService;


    Recipe recipeA;
    Category categoryA;
    Ingredient ingredientA;
    RecipeIngredient recipeIngredientA;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        recipeA = new Recipe();
        recipeA.setName("Recipe A");
        categoryA = new Category();
        categoryA.setName("categoryA");
        recipeA.setCategory(categoryA);
        ingredientA = new Ingredient();
        ingredientA.setName("Ingredient A");
        recipeIngredientA = new RecipeIngredient();
        recipeIngredientA.setIngredient(ingredientA);
        recipeIngredientA.setRecipe(recipeA);
        recipeIngredientA.setQuantity("200");
        recipeIngredientA.setUnit("g");
        recipeIngredientA.setOptional(false);
        recipeA.getRecipeIngredientList().add(recipeIngredientA);
    }

    @Test
    public void getRecipe() throws Exception {
        RecipeDto recipeADto = new RecipeDto();
        recipeADto.setId(recipeA.getId());
        recipeADto.setName(recipeA.getName());
        CategoryDto categoryADto = new CategoryDto();
        categoryADto.setId(categoryA.getId());
        categoryADto.setName(categoryA.getName());
        recipeADto.setCategory(categoryADto);

        RecipeDto.RecipeIngredientDto recipeIngredientDto = new RecipeDto.RecipeIngredientDto();
        recipeIngredientDto.setId(recipeIngredientA.getIngredient().getId());
        recipeIngredientDto.setName(recipeIngredientA.getIngredient().getName());
        recipeIngredientDto.setQuantity(recipeIngredientA.getQuantity());
        recipeIngredientDto.setUnit(recipeIngredientA.getUnit());
        recipeIngredientDto.setOptional(recipeIngredientA.isOptional());
        recipeADto.getIngredients().add(recipeIngredientDto);

        when(recipeService.getRecipe(recipeA.getId())).thenReturn(recipeA);
        when(mappingService.mapToRecipeDto(recipeA)).thenReturn(recipeADto);

        mvc.perform(get("/recipe/" + recipeA.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.id", is(recipeA.getId())))
                .andExpect(jsonPath("$.name", is(recipeA.getName())))
                .andExpect(jsonPath("$.category.id", is(recipeA.getCategory().getId())))
                .andExpect(jsonPath("$.category.name", is(recipeA.getCategory().getName())))
                .andExpect(jsonPath("$.ingredients[0].id", is(recipeA.getRecipeIngredientList().get(0).getIngredient().getId())))
                .andExpect(jsonPath("$.ingredients[0].name", is(recipeA.getRecipeIngredientList().get(0).getIngredient().getName())))
                .andExpect(jsonPath("$.ingredients[0].quantity", is(recipeA.getRecipeIngredientList().get(0).getQuantity())))
                .andExpect(jsonPath("$.ingredients[0].unit", is(recipeA.getRecipeIngredientList().get(0).getUnit())))
                .andExpect(jsonPath("$.ingredients[0].optional", is(recipeA.getRecipeIngredientList().get(0).isOptional())))
                .andDo(print());
    }

    @Test
    public void getRecipeHasSortedSteps() {
        fail("not implemented");
    }

    @Test
    public void addRecipe() {
        fail("not implemented");
    }

    @Test
    public void deleteRecipe() {
        fail("not implemented");
    }
}