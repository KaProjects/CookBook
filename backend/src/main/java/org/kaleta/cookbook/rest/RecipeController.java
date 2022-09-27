package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;

@RestController
@RequestMapping(value = "/recipe")
public class RecipeController {

    @Autowired
    RecipeService recipeService;

    @Autowired
    MappingService mappingService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public RecipeDto getRecipe(@PathVariable("id") String id) {
        RecipeDto recipeDto = mappingService.mapToRecipeDto(recipeService.getRecipe(id));
        recipeDto.getSteps().sort(new Comparator<RecipeDto.RecipeStepDto>() {
            @Override
            public int compare(RecipeDto.RecipeStepDto o1, RecipeDto.RecipeStepDto o2) {
                return o1.getNumber() - o2.getNumber();
            }
        });
        return recipeDto;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public String addRecipe(@Valid @RequestBody RecipeDto recipeDto) {
        Recipe recipe = mappingService.mapToRecipe(recipeDto);
        if (recipeDto.getId() == null) {
            return recipeService.createRecipe(recipe);
        } else {
            return recipeService.updateRecipe(recipe);
        }
    }

    @RequestMapping(value = "/{id}/delete", method = RequestMethod.GET)
    public void deleteRecipe(@PathVariable("id") String id) {
        recipeService.deleteRecipe(id);
    }
}
