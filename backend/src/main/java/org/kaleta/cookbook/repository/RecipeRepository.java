package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Recipe;

public interface RecipeRepository {

    /**
     * Returns Recipe according to name specified.
     */
    Recipe getByName(String name);
}
