package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** A cook's recipes grouped by category, categories and recipes in alphabetical order. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class RecipeListDto
{
    private List<Category> categories;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @RegisterForReflection
    public static class Category
    {
        private String name;
        private List<Item> recipes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @RegisterForReflection
    public static class Item
    {
        private String id;
        private String name;
        private boolean hasImage;
        private boolean hasSteps;
    }
}
