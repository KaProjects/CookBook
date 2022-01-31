package org.kaleta.cookbook.service;

import org.kaleta.cookbook.entity.Ingredient;

import java.util.List;

public interface IngredientService {

    List<Ingredient> listAllIngredients();

    Ingredient findIngredient(String id);

    String createIngredient(String name);
}
