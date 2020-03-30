package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.Recipe;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Set;


public class CategoryRepositoryImpl implements CategoryRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Recipe> getCategoryRecipes(String categoryId) {
        return entityManager.find(Category.class, categoryId).getRecipeSet();
    }
}
