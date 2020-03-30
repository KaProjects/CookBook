package org.kaleta.cookbook.dao;

import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.repository.IngredientRepository;
import org.springframework.data.repository.CrudRepository;

/**
 * Only to group CrudRepo and IngredientRepo.
 */
public interface IngredientDao extends CrudRepository<Ingredient, String>, IngredientRepository {

}
