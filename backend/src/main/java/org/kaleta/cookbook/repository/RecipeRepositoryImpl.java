package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;


public class RecipeRepositoryImpl implements RecipeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Recipe getByName(String name) {
        return entityManager.createQuery("select r from Recipe r where name=:name", Recipe.class).setParameter("name", name).getSingleResult();
    }

    @Override
    public List<EntityListItem> getRecipeList() {
        List<EntityListItem> listItems = new ArrayList<>();

        entityManager.createQuery("select id, name from Recipe r ", Object[].class).getResultStream()
                .forEach(item -> listItems.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));

        return listItems;
    }
}
