package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.MenuListDto;
import org.kaleta.cookbook.dto.RecipeListDto;
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

    @RequestMapping(value = "/menu")
    public MenuListDto getMenuList() {
        MenuListDto menuListDto = new MenuListDto();
        menuListDto.setIngredientList(ingredientService.getIngredientList());
        menuListDto.setCategoryList(categoryService.getCategoryList());
        return menuListDto;
    }

    @RequestMapping(value = "/recipe/all")
    public RecipeListDto getAllRecipeList() {
        RecipeListDto recipeListDto = new RecipeListDto();
        recipeListDto.setRecipeList(recipeService.getRecipeList());
        return recipeListDto;
    }
}
