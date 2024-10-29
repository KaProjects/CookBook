package org.kaleta.dto;

import lombok.Data;
import org.kaleta.entity.RecipeListItem;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class RecipeListByCategoryDto
{
    private List<CategoryDto> categories = new ArrayList<>();

    @Data
    static class CategoryDto
    {
        private String name;
        private List<RecipeListItemDto> recipes = new ArrayList<>();

        @Data
        static class RecipeListItemDto
        {
            private String id;
            private String name;
            private Boolean hasImage;
            private Boolean hasSteps;

            private static RecipeListItemDto from(RecipeListItem item)
            {
                RecipeListItemDto recipe = new RecipeListItemDto();
                recipe.setId(item.getId());
                recipe.setName(item.getName());
                recipe.setHasImage(item.getHasImage());
                recipe.setHasSteps(item.getHasSteps());
                return recipe;
            }
        }
    }

    public static RecipeListByCategoryDto from(Map<String, List<RecipeListItem>> map)
    {
        RecipeListByCategoryDto dto = new RecipeListByCategoryDto();
        for (String category : map.keySet())
        {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setName(category);
            for (RecipeListItem item : map.get(category))
            {
                categoryDto.getRecipes().add(CategoryDto.RecipeListItemDto.from(item));
            }
            dto.getCategories().add(categoryDto);
        }

        return dto;
    }
}
