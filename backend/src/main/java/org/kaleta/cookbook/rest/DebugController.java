package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.facade.RecipeFacade;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/data")
public class DebugController {

    @Autowired
    RecipeFacade recipeFacade;

    @Autowired
    RecipeService recipeService;

    @RequestMapping(value="/recipe/all")
    public List<RecipeDto> listRecipes() {
        return recipeFacade.listAllRecipes();
    }

    @RequestMapping(value="/recipe/clear")
    public void clearRecipes() {
         recipeService.removeRecipes();
    }
}
