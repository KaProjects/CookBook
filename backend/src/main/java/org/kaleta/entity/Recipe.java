package org.kaleta.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.dto.RecipeDto;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Recipe")
public class Recipe extends AbstractEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "image", nullable = true)
    private String image;

    @Column(name = "cook", nullable = false)
    private String cook;

    @OneToMany(mappedBy="sRecipe", cascade = CascadeType.ALL)
    @Setter(AccessLevel.NONE)
    private List<Step> steps = new ArrayList<>();

    @OneToMany(mappedBy="iRecipe", cascade = CascadeType.ALL)
    @Setter(AccessLevel.NONE)
    private List<Ingredient> ingredients = new ArrayList<>();

    public static Recipe from(RecipeCreateDto dto) {
        Recipe recipe = new Recipe();
        recipe.setName(dto.getName());
        recipe.setCook(dto.getCook());
        recipe.setCategory(dto.getCategory());
        recipe.setImage(dto.getImage());
        for (RecipeDto.StepDto stepDto : dto.getSteps()){
            Step step = new Step();
            step.setSRecipe(recipe);
            step.setNumber(stepDto.getNumber());
            step.setText(stepDto.getText());
            step.setOptional(stepDto.isOptional());
            recipe.getSteps().add(step);
        }
        for (RecipeDto.IngredientDto ingredientDto : dto.getIngredients()){
            Ingredient ingredient = new Ingredient();
            ingredient.setIRecipe(recipe);
            ingredient.setName(ingredientDto.getName());
            ingredient.setQuantity(ingredientDto.getQuantity());
            ingredient.setOptional(ingredientDto.isOptional());
            recipe.getIngredients().add(ingredient);
        }
        return recipe;
    }
}
