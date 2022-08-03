package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;

import java.util.List;
import java.util.Set;


public interface CategoryRepository {

    /**
     * Directly returns set of recipes, without Category.
     */
    Set<Recipe> getCategoryRecipes(String categoryId);

    /**
     * Returns list of all categories as <id,name>
     */
    List<EntityListItem> getCategoryList();
}
