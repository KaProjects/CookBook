package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.kaleta.dao.ListDao;

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
}
