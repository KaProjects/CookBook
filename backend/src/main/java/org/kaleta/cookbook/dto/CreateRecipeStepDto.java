package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class CreateRecipeStepDto {

    private Integer number;

    private String text;

    private boolean mandatory = true;


    @Override
    public String toString() {
        return "CreateRecipeStep{" +
                "number=" + number +
                ", text='" + text + '\'' +
                ", mandatory=" + mandatory +
                '}';
    }
}
