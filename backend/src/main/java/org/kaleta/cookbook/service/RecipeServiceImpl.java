package org.kaleta.cookbook.service;

import org.kaleta.cookbook.dao.RecipeDao;
import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    @Autowired
    RecipeDao recipeDao;


    @Override
    public List<Recipe> listAllRecipes() {
        return (List<Recipe>) recipeDao.findAll();
    }

    @Override
    public List<Recipe> listRecipesByCategory(String categoryId) {
        return ((List<Recipe>) recipeDao.findAll()).stream().filter(recipe -> recipe.getCategory().getId().equals(categoryId)).collect(Collectors.toList());
    }

    @Override
    public List<Recipe> listRecipesByIngredient(String ingredientId) {
        return ((List<Recipe>) recipeDao.findAll()).stream()
                .filter(recipe -> recipe.getRecipeIngredientList().stream()
                        .anyMatch(recipeIngredient -> recipeIngredient.getIngredient().getId().equals(ingredientId)))
                .collect(Collectors.toList());
    }

    @Override
    public String createRecipe(Recipe recipe){
        return recipeDao.save(recipe).getId();
    }


    @Override
    public void removeRecipes() {
        recipeDao.deleteAll();
    }

    @Override
    public List<EntityListItem> getRecipeList() {
        return recipeDao.getRecipeList();
    }

    @Override
    public List<EntityListItem> getIngredientRecipeList(String ingredientId) {
        return recipeDao.getIngredientRecipeList(ingredientId);
    }

    @Override
    public List<EntityListItem> getCategoryRecipeList(String categoryId) {
        return recipeDao.getCategoryRecipeList(categoryId);
    }

    @Override
    public Recipe getRecipe(String id) {
        return recipeDao.findById(id).get();
    }
}
