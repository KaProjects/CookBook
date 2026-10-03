package org.kaleta.persistence.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.kaleta.persistence.api.RecipeDao;
import org.kaleta.persistence.entity.Recipe;
import org.kaleta.persistence.entity.RecipeSummary;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class RecipeDaoImpl implements RecipeDao
{
    @PersistenceContext
    EntityManager entityManager;

    @Override
    public Optional<Recipe> find(String id)
    {
        return Optional.ofNullable(entityManager.find(Recipe.class, id));
    }

    @Transactional
    @Override
    public void create(Recipe recipe)
    {
        entityManager.persist(recipe);
    }

    @Transactional
    @Override
    public Recipe save(Recipe recipe)
    {
        return entityManager.merge(recipe);
    }

    @Override
    public List<String> listCategories(String cook)
    {
        return entityManager.createQuery(
                        "SELECT DISTINCT r.category FROM Recipe r WHERE r.cook = :cook", String.class)
                .setParameter("cook", cook)
                .getResultList();
    }

    @Override
    public List<String> listIngredients(String cook)
    {
        return entityManager.createQuery(
                        "SELECT DISTINCT i.name FROM Ingredient i WHERE i.recipe.cook = :cook", String.class)
                .setParameter("cook", cook)
                .getResultList();
    }

    /**
     * The filters are exact matches. They used to be LIKE patterns, so a category containing
     * '%' or '_' matched other categories as well.
     */
    @Override
    public List<RecipeSummary> listSummaries(String cook, String category, String ingredient)
    {
        StringBuilder jpql = new StringBuilder(
                "SELECT new org.kaleta.persistence.entity.RecipeSummary("
                        + "r.id, r.name, r.category, "
                        + "CASE WHEN r.image IS NULL THEN false ELSE true END, "
                        + "CASE WHEN EXISTS (SELECT s FROM Step s WHERE s.recipe = r) THEN true ELSE false END) "
                        + "FROM Recipe r WHERE r.cook = :cook");
        if (category != null) jpql.append(" AND r.category = :category");
        if (ingredient != null) jpql.append(" AND EXISTS (SELECT i FROM Ingredient i WHERE i.recipe = r AND i.name = :ingredient)");

        TypedQuery<RecipeSummary> query = entityManager.createQuery(jpql.toString(), RecipeSummary.class)
                .setParameter("cook", cook);
        if (category != null) query.setParameter("category", category);
        if (ingredient != null) query.setParameter("ingredient", ingredient);
        return query.getResultList();
    }
}
