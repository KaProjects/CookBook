package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.kaleta.dao.ListDao;
import org.kaleta.entity.RecipeListItem;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ListService {

    @Inject
    ListDao listDao;

    public List<String> listCategories(String cook) {
        return listDao.categories(cook);
    }

    public List<String> listIngredients(String cook) {
        return listDao.ingredients(cook);
    }

    public List<RecipeListItem> listRecipes(String cook){
        return listDao.recipes(cook);
    }

    public List<RecipeListItem> listRecipes(String cook, String category, String ingredient){
        return listDao.recipes(cook, category, ingredient);
    }

    public Map<String, List<RecipeListItem>> listRecipesByCategory(String cook)
    {
        Map<String, List<RecipeListItem>> map = new HashMap<>();
        for (RecipeListItem recipe : this.listRecipes(cook))
        {
            if (!map.containsKey(recipe.getCategory()))
            {
                map.put(recipe.getCategory(), new ArrayList<>());
            }
            map.get(recipe.getCategory()).add(recipe);
        }
        return map;
    }
}
