package org.kaleta.dto;

import lombok.Data;
import org.kaleta.entity.EntityListItem;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeListDto {
    private List<EntityListItem> recipes = new ArrayList<>();
}
