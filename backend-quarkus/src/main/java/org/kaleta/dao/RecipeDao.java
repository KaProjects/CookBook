package org.kaleta.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.entity.Recipe;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class RecipeDao {

    @Inject
    EntityManager em;

    public Recipe get(String id) {
        return em.createQuery("SELECT r FROM Recipe r WHERE r.id=:id", Recipe.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    public List<Recipe> getList() {
        return em.createQuery("SELECT r FROM Recipe r", Recipe.class).getResultList();
    }

    @Transactional
    public String create(Recipe recipe){
        em.persist(recipe);
        return recipe.getId();
    }
}
