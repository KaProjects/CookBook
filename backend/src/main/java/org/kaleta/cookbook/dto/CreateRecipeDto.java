package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class CreateRecipeDto {

    private String name;

    private String categoryId;

    private byte[] image;

    private List<CreateRecipeStepDto> steps = new ArrayList<>();

    private List<CreateRecipeIngredientDto> ingredients = new ArrayList<>();


    @Override
    public String toString() {
        return "\nCreateRecipe{" +
                "\nname='" + name + '\'' +
                "\ncategoryId='" + categoryId + '\'' +
                "\nimage=" + Arrays.toString(image) +
                "\nsteps=" + steps +
                "\ningredients=" + ingredients +
                "\n}";
    }
}
