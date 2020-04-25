package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class CreateRecipeIngredientDto {

    private String ingredientId;

    private Integer quantity;

    private String unit;

    private boolean mandatory = true;

    @Override
    public String toString() {
        return "CreateRecipeIngredient{" +
                "ingredientId='" + ingredientId + '\'' +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", mandatory=" + mandatory +
                '}';
    }
}
