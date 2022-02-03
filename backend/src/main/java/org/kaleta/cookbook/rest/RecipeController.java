package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.MenuListDto;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/recipe")
public class RecipeController {

    @Autowired
    RecipeService recipeService;

    @Autowired
    MappingService mappingService;

    @RequestMapping(value = "/{id}")
    public RecipeDto getRecipe(@PathVariable("id") String id) {
        return mappingService.mapToRecipeDto(recipeService.getRecipe(id));
    }
}
