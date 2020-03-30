package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Recipe;

import java.util.Set;


public interface CategoryRepository {

    /**
     * Directly returns set of recipes, without Category.
     */
    Set<Recipe> getCategoryRecipes(String categoryId);
}
