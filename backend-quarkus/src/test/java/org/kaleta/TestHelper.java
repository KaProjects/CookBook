package org.kaleta;

import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.dto.RecipeDto;

public class TestHelper {

    public static RecipeCreateDto createSampleRecipeCreateDto(){
        RecipeCreateDto dto = new RecipeCreateDto();
        dto.setName("new Recipe");
        dto.setCategory("new Cat");
        dto.setCook("new User");
        dto.setImage("new Image");
        RecipeDto.StepDto stepDto = new RecipeDto.StepDto();
        stepDto.setNumber(1);
        stepDto.setText("a step");
        stepDto.setOptional(false);
        dto.getSteps().add(stepDto);
        RecipeDto.IngredientDto ingredientDto = new RecipeDto.IngredientDto();
        ingredientDto.setName("a ingredient");
        ingredientDto.setQuantity("4ks");
        ingredientDto.setOptional(true);
        dto.getIngredients().add(ingredientDto);
        return dto;
    }
}
