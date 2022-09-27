package org.kaleta.cookbook.rest;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kaleta.cookbook.dto.CategoryDto;
import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.service.CategoryService;
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
@WebMvcTest(CategoryController.class)
public class CategoryControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    CategoryService categoryService;

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
    public void getCategory() throws Exception {
        CategoryDto categoryADto = new CategoryDto();
        categoryADto.setId(categoryA.getId());
        categoryADto.setName(categoryA.getName());

        when(categoryService.findCategory(categoryA.getId())).thenReturn(categoryA);
        when(mappingService.mapTo(categoryA, CategoryDto.class)).thenReturn(categoryADto);

        mvc.perform(get("/category/" + categoryA.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.id", is(categoryA.getId())))
                .andExpect(jsonPath("$.name", is(categoryA.getName())))
                .andDo(print());
    }

    @Test
    public void addCategory() {
        fail("not implemented");
    }

    @Test
    public void deleteCategory() {
        fail("not implemented");
    }
}