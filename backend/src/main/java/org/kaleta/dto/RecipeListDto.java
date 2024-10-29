package org.kaleta.dto;

import lombok.Data;
import org.kaleta.entity.RecipeListItem;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeListDto {
    private List<RecipeListItem> recipes = new ArrayList<>();
}
