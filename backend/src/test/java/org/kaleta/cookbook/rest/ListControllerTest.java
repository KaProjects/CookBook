package org.kaleta.cookbook.rest;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.entity.EntityListItem;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.fail;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.oneOf;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(ListController.class)
public class ListControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    CategoryService categoryService;

    @MockBean
    IngredientService ingredientService;

    @MockBean
    RecipeService recipeService;

    @MockBean
    MappingService mappingService;

    Category categoryA;
    Category categoryB;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        categoryA = new Category();
        categoryA.setName("categoryA");
        categoryB = new Category();
        categoryB.setName("categoryB");
    }

    @Test
    public void getAllCategoryList() throws Exception {
        when(categoryService.getCategoryList()).thenReturn(List.of(
                new EntityListItem(categoryA.getId(),categoryA.getName()),
                new EntityListItem(categoryB.getId(),categoryB.getName())
        ));

        mvc.perform(get("/list/category/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.categories",hasSize(2)))
                .andExpect(jsonPath("$.categories[0].id", oneOf(categoryA.getId(), categoryB.getId())))
                .andDo(print());
    }

    @Test
    public void getAllIngredientList() {
        fail("not implemented");
    }

    @Test
    public void getMenuList() {
        fail("not implemented");
    }

    @Test
    public void getAllRecipeList() {
        fail("not implemented");
    }

    @Test
    public void getIngredientRecipeList() {
        fail("not implemented");
    }

    @Test
    public void getCategoryRecipeList() {
        fail("not implemented");
    }
}