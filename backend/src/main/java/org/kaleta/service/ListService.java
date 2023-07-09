package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.kaleta.dao.ListDao;
import org.kaleta.entity.EntityListItem;

import java.util.List;

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

    public List<EntityListItem> listRecipes(String cook){
        return listDao.recipes(cook);
    }

    public List<EntityListItem> listRecipes(String cook, String category, String ingredient){
        return listDao.recipes(cook, category, ingredient);
    }
}
