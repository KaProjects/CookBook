package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.kaleta.cookbook.entity.EntityListItem;

import java.util.ArrayList;
import java.util.List;

@Getter
@EqualsAndHashCode
public class RecipeListDto {

    private final List<EntityListItem> recipes = new ArrayList<>();

    public void setRecipeList(List<EntityListItem> list){
        recipes.addAll(list);
    }

    @Override
    public String toString() {
        return "RecipeListDto{" +
                "recipes=" + recipes +
                '}';
    }
}
