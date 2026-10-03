package org.kaleta.persistence.api;

import org.kaleta.persistence.entity.Recipe;
import org.kaleta.persistence.entity.RecipeSummary;

import java.util.List;
import java.util.Optional;

public interface RecipeDao
{
    /**
     * @return the recipe with its steps and ingredients, or empty if there is none of that ID
     */
    Optional<Recipe> find(String id);

    /**
     * persists a new recipe together with its steps and ingredients
     */
    void create(Recipe recipe);

    /**
     * writes the changes of a recipe, replacing its steps and ingredients with the ones it holds
     */
    Recipe save(Recipe recipe);

    /**
     * @return the distinct categories of the cook's recipes
     */
    List<String> listCategories(String cook);

    /**
     * @return the distinct ingredient names used in the cook's recipes
     */
    List<String> listIngredients(String cook);

    /**
     * @param category only recipes of exactly this category, or all when null
     * @param ingredient only recipes using exactly this ingredient, or all when null
     * @return the cook's recipes, one row each
     */
    List<RecipeSummary> listSummaries(String cook, String category, String ingredient);
}
