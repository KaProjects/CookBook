package org.kaleta.dto;

import lombok.Data;
import org.kaleta.entity.Ingredient;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.Step;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeDto {
    private String name;
    private String category;
    private String image;
    private List<StepDto> stepList = new ArrayList<>();
    private List<IngredientDto> ingredientList = new ArrayList<>();

    public RecipeDto(Recipe recipe) {
        name = recipe.getName();
        category = recipe.getCategory();
        for (Step step : recipe.getStepList()){
            stepList.add(new StepDto(step));
        }
        for (Ingredient ingredient : recipe.getIngredientList()){
            ingredientList.add(new IngredientDto(ingredient));
        }
    }

    @Data
    private static class StepDto {
        private Integer number;
        private String text;
        private boolean optional;

        private StepDto(Step step){
            number = step.getNumber();
            text = step.getText();
            optional = step.isOptional();
        }
    }

    @Data
    private static class IngredientDto {
        private String name;
        private String quantity;
        private boolean optional;

        private IngredientDto(Ingredient ingredient){
            name = ingredient.getName();
            quantity = ingredient.getQuantity();
            optional = ingredient.isOptional();
        }
    }
}
