package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.entity.RecipeIngredient;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
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

    @Override
    public List<EntityListItem> getIngredientList() {
        List<EntityListItem> listItems = new ArrayList<>();

        entityManager.createQuery("select id, name from Ingredient i ", Object[].class).getResultStream()
                .forEach(item -> listItems.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));

        return listItems;
    }


}
