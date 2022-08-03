package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


public class CategoryRepositoryImpl implements CategoryRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Recipe> getCategoryRecipes(String categoryId) {
        return entityManager.find(Category.class, categoryId).getRecipeSet();
    }

    @Override
    public List<EntityListItem> getCategoryList() {
        List<EntityListItem> listItems = new ArrayList<>();

        entityManager.createQuery("select id, name from Category c ", Object[].class).getResultStream()
                .forEach(item -> listItems.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));

        return listItems;
    }
}
