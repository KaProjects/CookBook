package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.Recipe;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


public class RecipeRepositoryImpl implements RecipeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Recipe getByName(String name) {
        return entityManager.createQuery("select r from Recipe r where name=:name", Recipe.class).setParameter("name", name).getSingleResult();
    }
}
