package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.kaleta.rest.validation.ValidImage;

import java.util.ArrayList;
import java.util.List;

/** The editable part of a recipe: everything but its ID and its cook. */
@Data
@RegisterForReflection
public class RecipeUpdateDto
{
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 100)
    private String category;

    @ValidImage
    private String image;

    @NotNull
    @Valid
    private List<@NotNull StepDto> steps = new ArrayList<>();

    @NotNull
    @Valid
    private List<@NotNull IngredientDto> ingredients = new ArrayList<>();
}
