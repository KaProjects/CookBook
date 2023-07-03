package org.kaleta.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.kaleta.entity.EntityListItem;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<EntityListItem> recipes(String cook) {
        List<EntityListItem> items = new ArrayList<>();
        em.createQuery("SELECT r.id, r.name FROM Recipe r" + whereCook, Object[].class)
                .setParameter("cook", cook)
                .getResultStream()
                .forEach(item -> items.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));
        return items;
    }

    public List<EntityListItem> recipes(String cook, String category) {
        List<EntityListItem> items = new ArrayList<>();
        em.createQuery("SELECT r.id, r.name FROM Recipe r" + whereCook + " AND r.category=:category", Object[].class)
                .setParameter("cook", cook)
                .setParameter("category", category)
                .getResultStream()
                .forEach(item -> items.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));
        return items;
    }
}
