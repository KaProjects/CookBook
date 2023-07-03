package org.kaleta.dto;

import lombok.Data;
import org.kaleta.entity.Ingredient;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.Step;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeDto {
    private String id;
    private String name;
    private String category;
    private String image;
    private List<StepDto> steps = new ArrayList<>();
    private List<IngredientDto> ingredients = new ArrayList<>();

    public RecipeDto(Recipe recipe) {
        id = recipe.getId();
        name = recipe.getName();
        category = recipe.getCategory();
        for (Step step : recipe.getSteps()){
            steps.add(new StepDto(step));
        }
        for (Ingredient ingredient : recipe.getIngredients()){
            ingredients.add(new IngredientDto(ingredient));
        }
    }

    public static List<RecipeDto> list(List<Recipe> recipes){
        List<RecipeDto> recipeDtos = new ArrayList<>();
        for (Recipe recipe : recipes){
            recipeDtos.add(new RecipeDto(recipe));
        }
        return recipeDtos;
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
