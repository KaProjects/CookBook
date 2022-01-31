package org.kaleta.cookbook.service;

import org.kaleta.cookbook.dao.IngredientDao;
import org.kaleta.cookbook.entity.Ingredient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientServiceImpl implements IngredientService {

    @Autowired
    IngredientDao ingredientDao;

    @Override
    public List<Ingredient> listAllIngredients() {
        return (List<Ingredient>) ingredientDao.findAll();
    }

    @Override
    public Ingredient findIngredient(String id) {
        return ingredientDao.findById(id).get();
    }

    @Override
    public String createIngredient(String name) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);
        return ingredientDao.save(ingredient).getId();
    }
}
