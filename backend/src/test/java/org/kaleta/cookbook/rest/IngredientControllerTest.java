package org.kaleta.cookbook.rest;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.dto.IngredientDto;
import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.fail;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(IngredientController.class)
public class IngredientControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    IngredientService ingredientService;

    @MockBean
    MappingService mappingService;

    Ingredient ingredientA;
    Ingredient ingredientB;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        ingredientA = new Ingredient();
        ingredientA.setName("Ingredient A");
        ingredientB = new Ingredient();
        ingredientB.setName("Ingredient B");
    }

    @Test
    public void getIngredient() throws Exception {
        IngredientDto ingredientADto = new IngredientDto();
        ingredientADto.setId(ingredientA.getId());
        ingredientADto.setName(ingredientA.getName());

        when(ingredientService.findIngredient(ingredientA.getId())).thenReturn(ingredientA);
        when(mappingService.mapTo(ingredientA, IngredientDto.class)).thenReturn(ingredientADto);

        mvc.perform(get("/ingredient/" + ingredientA.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.id", is(ingredientA.getId())))
                .andExpect(jsonPath("$.name", is(ingredientA.getName())))
                .andDo(print());
    }

    @Test
    public void addIngredient() {
        fail("not implemented");
    }

    @Test
    public void deleteIngredient() {
        fail("not implemented");
    }
}