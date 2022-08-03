package org.kaleta.cookbook.service;

import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Ingredient;

import java.util.List;

public interface IngredientService {

    List<Ingredient> listAllIngredients();

    Ingredient findIngredient(String id);

    String createIngredient(String name);

    List<EntityListItem> getIngredientList();

    void deleteIngredient(String id);
}
