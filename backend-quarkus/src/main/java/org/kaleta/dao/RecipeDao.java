package org.kaleta.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.kaleta.entity.Recipe;

import java.util.List;

@ApplicationScoped
public class RecipeDao {

    @Inject
    EntityManager em;

    public Recipe getRecipe(String id) {
        return em.createQuery("select r from Recipe r where r.id=:id", Recipe.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    public List<Recipe> getRecipes() {
        return em.createQuery("select r from Recipe r", Recipe.class).getResultList();
    }
}
