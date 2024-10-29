package org.kaleta.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.kaleta.entity.RecipeListItem;

import java.util.ArrayList;
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

    public List<RecipeListItem> recipes(String cook, String category, String ingredient) {
        if (category == null) category = "%";
        if (ingredient == null) ingredient = "%";

        List<RecipeListItem> items = new ArrayList<>();

        em.createQuery("SELECT DISTINCT r.id, r.name, r.category, (r.image IS NOT NULL), (count(s.id) > 0) FROM Recipe r LEFT JOIN Ingredient i ON r.id=i.iRecipe.id LEFT JOIN Step s ON r.id=s.sRecipe.id"
                        + whereCook
                        + " AND r.category LIKE :category"
                        + ((ingredient.equals("%")) ? " AND (i.name IS NULL OR i.name LIKE :ingredient)" : " AND i.name=:ingredient")
                        + " GROUP BY r.id", Object[].class)
                .setParameter("cook", cook)
                .setParameter("category", category)
                .setParameter("ingredient", ingredient)
                .getResultStream()
                .forEach(object -> {
                    RecipeListItem item = new RecipeListItem(String.valueOf(object[0]), String.valueOf(object[1]));
                    item.setCategory(String.valueOf(object[2]));
                    item.setHasImage(Boolean.valueOf(String.valueOf(object[3])));
                    item.setHasSteps(Boolean.valueOf(String.valueOf(object[4])));
                    items.add(item);
                });

        return items;
    }
}
