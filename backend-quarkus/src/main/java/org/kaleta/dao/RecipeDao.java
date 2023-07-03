package org.kaleta.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.kaleta.entity.Recipe;

@ApplicationScoped
public class RecipeDao {

    @Inject
    EntityManager em;

    public Recipe getRecipe(String id) {
        return em.find(Recipe.class, id);
    }
}
