package org.kaleta.cookbook.facade;

import org.kaleta.cookbook.dto.CreateRecipeDto;
import org.kaleta.cookbook.dto.RecipeDto;

import java.util.List;

public interface RecipeFacade {

    List<RecipeDto> listAllRecipes();

    List<RecipeDto> listRecipesByCategory(String categoryId);

    List<RecipeDto> listRecipesByIngredient(String ingredientId);

    String createRecipe(CreateRecipeDto createRecipeDto);
}
