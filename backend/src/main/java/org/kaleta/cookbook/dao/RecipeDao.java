package org.kaleta.cookbook.dao;

import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.repository.RecipeRepository;
import org.springframework.data.repository.CrudRepository;

/**
 * Only to group CrudRepo and RecipeRepo.
 */
public interface RecipeDao extends CrudRepository<Recipe, String>, RecipeRepository {

}
