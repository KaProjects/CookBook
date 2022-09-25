package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class RecipeDto {

    private String id;

    private String name;

    private CategoryDto category;

    private String image;

    private List<RecipeIngredientDto> ingredients = new ArrayList<>();

    private List<RecipeStepDto> steps = new ArrayList<>();

    @Override
    public String toString() {
        return "RecipeDto{" +
                "\nid='" + id + '\'' +
                "\nname='" + name + '\'' +
                "\ncategory='" + category + '\'' +
                "\nimage=" + image +
                "\ningredients=" + ingredients +
                "\nsteps=" + steps +
                "\n}";
    }

    @Getter
    @Setter
    @EqualsAndHashCode
    public static class RecipeStepDto {

        private Integer number;

        private String text;

        private boolean optional;

        @Override
        public String toString() {
            return "Step{" +
                    "number=" + number +
                    " | text='" + text + '\'' +
                    " | optional=" + optional +
                    '}';
        }
    }

    @Getter
    @Setter
    @EqualsAndHashCode
    public static class RecipeIngredientDto {

        private String id;

        private String name;

        private String quantity;

        private String unit;

        private boolean optional;

        @Override
        public String toString() {
            return "Ingredient{" +
                    "id='" + id + '\'' +
                    "name='" + name + '\'' +
                    " | quantity=" + quantity +
                    " | unit='" + unit + '\'' +
                    " | optional=" + optional +
                    '}';
        }
    }
}
