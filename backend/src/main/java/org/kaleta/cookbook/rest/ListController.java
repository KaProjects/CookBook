package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.CategoryListDto;
import org.kaleta.cookbook.dto.IngredientListDto;
import org.kaleta.cookbook.dto.MenuListDto;
import org.kaleta.cookbook.dto.RecipeListDto;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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

    @RequestMapping(value = "/recipe/ingredient/{id}")
    public RecipeListDto getIngredientRecipeList(@PathVariable("id") String id) {
        RecipeListDto recipeListDto = new RecipeListDto();
        recipeListDto.setRecipeList(recipeService.getIngredientRecipeList(id));
        return recipeListDto;
    }

    @RequestMapping(value = "/recipe/category/{id}")
    public RecipeListDto getCategoryRecipeList(@PathVariable("id") String id) {
        RecipeListDto recipeListDto = new RecipeListDto();
        recipeListDto.setRecipeList(recipeService.getCategoryRecipeList(id));
        return recipeListDto;
    }

    @RequestMapping(value = "/category/all")
    public CategoryListDto getAllCategoryList() {
        CategoryListDto categoryListDto = new CategoryListDto();
        categoryListDto.setCategoryList(categoryService.getCategoryList());
        return categoryListDto;
    }

    @RequestMapping(value = "/ingredient/all")
    public IngredientListDto getAllIngredientList() {
        IngredientListDto ingredientListDto = new IngredientListDto();
        ingredientListDto.setIngredientList(ingredientService.getIngredientList());
        return ingredientListDto;
    }
}
