package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@RegisterForReflection
public class RecipeDto
{
    private String id;
    private String cook;
    private String name;
    private String category;
    private String image;
    private List<StepDto> steps = new ArrayList<>();
    private List<IngredientDto> ingredients = new ArrayList<>();
}
