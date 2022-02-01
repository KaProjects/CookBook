package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.DataListDto;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/list")
public class ListController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    IngredientService ingredientService;

    @Autowired
    RecipeService recipeService;

    @Autowired
    MappingService mappingService;

    @RequestMapping(value = "/all")
    public DataListDto getRecipeList() {
        DataListDto dataListDto = new DataListDto();
        dataListDto.setRecipeList(recipeService.getRecipeList());
        dataListDto.setIngredientList(ingredientService.getIngredientList());
        dataListDto.setCategoryList(categoryService.getCategoryList());
        return dataListDto;
    }
}
