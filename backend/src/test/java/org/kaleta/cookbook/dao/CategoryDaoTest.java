package org.kaleta.cookbook.dao;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

@RunWith(SpringRunner.class)
@DataJpaTest
public class CategoryDaoTest {

    @Autowired private EntityManager entityManager;

    @Autowired private CategoryDao categoryDao;

    private Category categoryA;
    private Recipe recipeA;
    private Recipe recipeB;

    @Before
    public void before(){
        assertThat(entityManager).isNotNull();
        assertThat(categoryDao).isNotNull();

        categoryA = new Category();
        categoryA.setName("Category A");

        recipeA = new Recipe();
        recipeA.setName("Recipe A");
        recipeA.setCategory(categoryA);

        recipeB = new Recipe();
        recipeB.setName("Recipe B");
        recipeB.setCategory(categoryA);

        entityManager.persist(categoryA);
        entityManager.persist(recipeA);
        entityManager.persist(recipeB);
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void createCategory() {
        Category category = new Category();
        category.setName("New Category");

        categoryDao.save(category);

        Category foundCategory = entityManager.find(Category.class, category.getId());
        assertThat(foundCategory).isNotNull();
    }

    @Test
    public void getCategoryRecipes() {
        Set<Recipe> recipeSet = categoryDao.getCategoryRecipes(categoryA.getId());

        assertThat(recipeSet).contains(recipeA).contains(recipeB).hasSize(2);
        assertThat(recipeSet.stream().anyMatch(r -> r.getCategory().equals(categoryA))).isTrue();
    }
    @Test
    public void getCategoryList() {
        fail("not implemented");
    }
}
