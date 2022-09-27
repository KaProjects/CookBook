package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.IngredientDto;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/ingredient")
public class IngredientController {

    @Autowired
    IngredientService ingredientService;

    @Autowired
    MappingService mappingService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public IngredientDto getIngredient(@PathVariable("id") String id) {
        return mappingService.mapTo(ingredientService.findIngredient(id), IngredientDto.class);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public String addIngredient(@Valid @RequestBody IngredientDto ingredientDto) {
        return ingredientService.createIngredient(ingredientDto.getName());
    }

    @RequestMapping(value = "/{id}/delete", method = RequestMethod.GET)
    public void deleteIngredient(@PathVariable("id") String id) {
        ingredientService.deleteIngredient(id);
    }
}
