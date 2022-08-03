package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.kaleta.cookbook.entity.EntityListItem;

import java.util.ArrayList;
import java.util.List;

@Getter
@EqualsAndHashCode
public class IngredientListDto {

    private final List<EntityListItem> ingredients = new ArrayList<>();

    public void setIngredientList(List<EntityListItem> list){
        ingredients.addAll(list);
    }

    @Override
    public String toString() {
        return "RecipeListDto{" +
                "recipes=" + ingredients +
                '}';
    }
}
