package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Recipe;

import java.util.Set;

public interface IngredientRepository {

    /**
     * Directly returns set of recipes, without Ingredient and RecipeIngredient.
     */
    Set<Recipe> getIngredientRecipes(String ingredientId);
}
