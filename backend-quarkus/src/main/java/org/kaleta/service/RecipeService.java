package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.kaleta.dao.RecipeDao;
import org.kaleta.dto.RecipeDto;

@ApplicationScoped
public class RecipeService {
    @Inject
    RecipeDao recipeDao;

    public RecipeDto getRecipe(String id) {
        return new RecipeDto(recipeDao.getRecipe(id));
    }
}
