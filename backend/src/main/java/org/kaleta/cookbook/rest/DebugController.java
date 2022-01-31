package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.CategoryDto;
import org.kaleta.cookbook.dto.IngredientDto;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.Ingredient;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.facade.RecipeFacade;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/data")
public class DebugController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    IngredientService ingredientService;

    @Autowired
    RecipeService recipeService;

    @Autowired
    MappingService mappingService;

    @RequestMapping(value="/recipe/all")
    public List<RecipeDto> listRecipes() {
        return mappingService.mapToRecipeDtoList(recipeService.listAllRecipes());
    }

    @RequestMapping(value="/recipe/clear")
    public void clearRecipes() {
         recipeService.removeRecipes();
    }

    @RequestMapping(value="/category/create/{name}")
    public String createCategory(@PathVariable String name) {
        return categoryService.createCategory(name);
    }

    @RequestMapping(value="/ingredient/create/{name}")
    public String createIngredient(@PathVariable String name) {
        return ingredientService.createIngredient(name);
    }

    @RequestMapping(value="/ingredient/all")
    public List<IngredientDto> listIngredient() {
        return mappingService.mapTo(ingredientService.listAllIngredients(), IngredientDto.class);
    }

    @RequestMapping(value="/category/all")
    public List<CategoryDto> listCategory() {
        return mappingService.mapTo(categoryService.listAllCategories(), CategoryDto.class);
    }
}
