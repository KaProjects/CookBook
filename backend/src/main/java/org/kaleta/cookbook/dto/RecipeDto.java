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
public class RecipeDto {

    private String id;

    private String name;

    private String category;

    private byte[] image;

    private List<RecipeDto.Ingredient> ingredients = new ArrayList<>();

    private List<RecipeDto.Step> steps = new ArrayList<>();

    @Override
    public String toString() {
        return "RecipeDto{" +
                "\nid='" + id + '\'' +
                "\nname='" + name + '\'' +
                "\ncategory='" + category + '\'' +
                "\nimage=" + Arrays.toString(image) +
                "\ningredients=" + ingredients +
                "\nsteps=" + steps +
                "\n}";
    }

    @Getter
    @Setter
    @EqualsAndHashCode
    public static class Step {

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
    public static class Ingredient {

        private String name;

        private Integer quantity;

        private String unit;

        private boolean optional;

        @Override
        public String toString() {
            return "Ingredient{" +
                    "name='" + name + '\'' +
                    " | quantity=" + quantity +
                    " | unit='" + unit + '\'' +
                    " | optional=" + optional +
                    '}';
        }
    }
}
