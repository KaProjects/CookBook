package org.kaleta.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeCreateDto {
    private String cook;
    private String name;
    private String category;
    private String image;
    private List<RecipeDto.StepDto> steps = new ArrayList<>();
    private List<RecipeDto.IngredientDto> ingredients = new ArrayList<>();
}
