package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.entity.RecipeIngredient;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Set;
import java.util.stream.Collectors;


public class IngredientRepositoryImpl implements IngredientRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Recipe> getIngredientRecipes(String ingredientId) {
        return entityManager.find(Ingredient.class, ingredientId)
                .getRecipeIngredientSet()
                .stream()
                .map(RecipeIngredient::getRecipe)
                .collect(Collectors.toSet());
    }
}
