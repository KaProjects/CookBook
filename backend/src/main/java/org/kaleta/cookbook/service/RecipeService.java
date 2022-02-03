package org.kaleta.cookbook.service;


import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;

import java.util.List;

public interface RecipeService {

    List<Recipe> listAllRecipes();

    List<Recipe> listRecipesByCategory(String categoryId);

    List<Recipe> listRecipesByIngredient(String ingredientId);

    String createRecipe(Recipe recipe);

    void removeRecipes();


    List<EntityListItem> getRecipeList();
    List<EntityListItem> getIngredientRecipeList(String ingredientId);
    List<EntityListItem> getCategoryRecipeList(String categoryId);

    Recipe getRecipe(String id);

}
