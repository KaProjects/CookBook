package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.kaleta.cookbook.entity.EntityListItem;

import java.util.ArrayList;
import java.util.List;

@Getter
@EqualsAndHashCode
public class DataListDto {

    private final List<EntityListItem> recipes = new ArrayList<>();

    private final List<EntityListItem> ingredients = new ArrayList<>();

    private final List<EntityListItem> categories = new ArrayList<>();

    public void setRecipeList(List<EntityListItem> list){
        recipes.addAll(list);
    }

    public void setIngredientList(List<EntityListItem> list){
        ingredients.addAll(list);
    }

    public void setCategoryList(List<EntityListItem> list){
        categories.addAll(list);
    }

    @Override
    public String toString() {
        return "DataListDto{" +
                "recipes=" + recipes +
                ", ingredients=" + ingredients +
                ", categories=" + categories +
                '}';
    }
}
