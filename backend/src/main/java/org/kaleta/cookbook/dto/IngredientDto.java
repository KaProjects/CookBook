package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class IngredientDto {

    private String id;

    private String name;


    @Override
    public String toString() {
        return "\nIngredientDto{" +
                "\nid='" + id + '\'' +
                "\nname='" + name + '\'' +
                "\n}";
    }
}
