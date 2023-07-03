package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import org.kaleta.dao.RecipeDao;
import org.kaleta.entity.Recipe;

import java.util.List;

@ApplicationScoped
public class RecipeService {

    @Inject
    RecipeDao recipeDao;

    public Recipe getRecipe(String id) {
        try {
            return recipeDao.get(id);
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<Recipe> getRecipes() {
        return recipeDao.getList();
    }

    public String createRecipe(Recipe recipe) {
        return recipeDao.create(recipe);
    }
}
