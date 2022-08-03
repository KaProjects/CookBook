package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;

import java.util.List;

public interface RecipeRepository {

    /**
     * Returns Recipe according to name specified.
     */
    Recipe getByName(String name);

    /**
     * Returns list of all recipes as <id,name>
     */
    List<EntityListItem> getRecipeList();

    /**
     * Returns list of all recipes as <id,name> for specified ingredient
     */
    List<EntityListItem> getIngredientRecipeList(String ingredientId);

    /**
     * Returns list of all recipes as <id,name> for specified category
     */
    List<EntityListItem> getCategoryRecipeList(String categoryId);


}