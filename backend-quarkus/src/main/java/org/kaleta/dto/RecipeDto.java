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

    public static RecipeDto from(Recipe recipe) {
        RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getId());
        dto.setName(recipe.getName());
        dto.setCategory(recipe.getCategory());
        dto.setImage(recipe.getImage());
        for (Step step : recipe.getSteps()){
            dto.getSteps().add(StepDto.from(step));
        }
        for (Ingredient ingredient : recipe.getIngredients()){
            dto.getIngredients().add(IngredientDto.from(ingredient));
        }
        return dto;
    }
    public static List<RecipeDto> list(List<Recipe> recipes){
        List<RecipeDto> recipeDtos = new ArrayList<>();
        for (Recipe recipe : recipes){
            recipeDtos.add(RecipeDto.from(recipe));
        }
        return recipeDtos;
    }

    @Data
    public static class StepDto {
        private Integer number;
        private String text;
        private boolean optional;

        public static StepDto from(Step step) {
            StepDto dto = new StepDto();
            dto.setText(step.getText());
            dto.setNumber(step.getNumber());
            dto.setOptional(step.isOptional());
            return dto;
        }
    }

    @Data
    public static class IngredientDto {
        private String name;
        private String quantity;
        private boolean optional;

        public static IngredientDto from(Ingredient ingredient) {
            IngredientDto dto = new IngredientDto();
            dto.setName(ingredient.getName());
            dto.setQuantity(ingredient.getQuantity());
            dto.setOptional(ingredient.isOptional());
            return dto;
        }
    }
}
