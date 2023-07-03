package org.kaleta.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class ListDao {

    @Inject
    EntityManager em;

    private String whereCook = " where r.cook=:cook";
    public List<String> categories(String cook) {
        return em.createQuery("SELECT DISTINCT r.category FROM Recipe r" + whereCook, String.class)
                .setParameter("cook", cook)
                .getResultList();
    }

    public List<String> ingredients(String cook) {
        return em.createQuery("SELECT DISTINCT i.name FROM Ingredient i INNER JOIN Recipe r ON r.id=i.iRecipe.id" + whereCook, String.class)
                .setParameter("cook", cook)
                .getResultList();
    }

//    public List<String> recipes(String cook) {
//
//    }
}
