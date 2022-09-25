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

    private String image;

    private List<CreateRecipeStepDto> steps = new ArrayList<>();

    private List<CreateRecipeIngredientDto> ingredients = new ArrayList<>();


    @Override
    public String toString() {
        return "\nCreateRecipe{" +
                "\nname='" + name + '\'' +
                "\ncategoryId='" + categoryId + '\'' +
                "\nimage=" + image +
                "\nsteps=" + steps +
                "\ningredients=" + ingredients +
                "\n}";
    }
}
