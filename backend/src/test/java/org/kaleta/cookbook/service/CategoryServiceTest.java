package org.kaleta.cookbook.service;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.dao.CategoryDao;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.Recipe;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.*;


public class CategoryServiceTest {

    @Mock
    private CategoryDao categoryDao;

    @InjectMocks
    private CategoryService categoryService = new CategoryServiceImpl();

    private Category categoryA;
    private Category categoryB;
    private Recipe recipeA;
    private Recipe recipeB;

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);

        categoryA = new Category();
        categoryA.setName("Category A");

        categoryB = new Category();
        categoryB.setName("Category B");

        recipeA = new Recipe();
        recipeA.setName("Recipe A");
        recipeA.setCategory(categoryA);

        recipeB = new Recipe();
        recipeB.setName("Recipe B");
        recipeB.setCategory(categoryA);
    }

    @Test
    public void listAllCategories() {
        when(categoryDao.findAll()).thenReturn(List.of(categoryA, categoryB));

        List<Category> result = categoryService.listAllCategories();

        assertThat(result).hasSize(2);
        verify(categoryDao, times(1)).findAll();
    }

    @Test
    public void findCategory() {
        fail("not implemented");
    }

    @Test
    public void createCategory() {
        fail("not implemented");
    }

    @Test
    public void getCategoryList() {
        fail("not implemented");
    }

    @Test
    public void deleteCategory() {
        fail("not implemented");
    }
}