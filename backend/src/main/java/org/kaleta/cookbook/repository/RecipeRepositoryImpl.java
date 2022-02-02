package org.kaleta.cookbook.repository;

import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.entity.Recipe;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;


public class RecipeRepositoryImpl implements RecipeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Recipe getByName(String name) {
        return entityManager.createQuery("select r from Recipe r where name=:name", Recipe.class).setParameter("name", name).getSingleResult();
    }

    @Override
    public List<EntityListItem> getRecipeList() {
        List<EntityListItem> listItems = new ArrayList<>();

        entityManager.createQuery("select id, name from Recipe r ", Object[].class).getResultStream()
                .forEach(item -> listItems.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));

        return listItems;
    }

    @Override
    public List<EntityListItem> getIngredientRecipeList(String ingredientId) {
        List<EntityListItem> listItems = new ArrayList<>();

        entityManager.createQuery(
                "select r.id, r.name from Recipe r inner join RecipeIngredient ri on r.id=ri.recipe.id where ri.ingredient.id=:iid"
                , Object[].class).setParameter("iid", ingredientId).getResultStream()
                .forEach(item -> listItems.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));

        return listItems;
    }

    @Override
    public List<EntityListItem> getCategoryRecipeList(String categoryId) {
        System.out.println(categoryId);
        List<EntityListItem> listItems = new ArrayList<>();

        entityManager.createQuery("select r.id, r.name from Recipe r where r.category.id=:cid", Object[].class).setParameter("cid", categoryId).getResultStream()
                .forEach(item -> listItems.add(new EntityListItem(String.valueOf(item[0]), String.valueOf(item[1]))));

        return listItems;
    }
}
