package org.kaleta.cookbook.service;

import org.junit.Before;
import org.junit.Test;
import org.kaleta.cookbook.dao.IngredientDao;
import org.kaleta.cookbook.entity.Ingredient;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.*;

public class IngredientServiceTest {

    @Mock
    private IngredientDao ingredientDao;

    @InjectMocks
    private IngredientService ingredientService = new IngredientServiceImpl();

    private Ingredient ingredientA;
    private Ingredient ingredientB;

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);

        ingredientA = new Ingredient();
        ingredientA.setName("Ingredient A");
        ingredientB = new Ingredient();
        ingredientB.setName("Ingredient B");
    }

    @Test
    public void listAllIngredients() {
        when(ingredientDao.findAll()).thenReturn(Arrays.asList(ingredientA, ingredientB));

        List<Ingredient> result = ingredientService.listAllIngredients();

        assertThat(result).hasSize(2);
        verify(ingredientDao, times(1)).findAll();

    }

    @Test
    public void findIngredient() {
        fail("not implemented");
    }

    @Test
    public void createIngredient() {
        fail("not implemented");
    }

    @Test
    public void getIngredientList() {
        fail("not implemented");
    }

    @Test
    public void deleteIngredient() {
        fail("not implemented");
    }
}