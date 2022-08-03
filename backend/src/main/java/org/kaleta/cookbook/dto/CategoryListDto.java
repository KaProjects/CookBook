package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.kaleta.cookbook.entity.EntityListItem;

import java.util.ArrayList;
import java.util.List;

@Getter
@EqualsAndHashCode
public class CategoryListDto {

    private final List<EntityListItem> categories = new ArrayList<>();

    public void setCategoryList(List<EntityListItem> list){
        categories.addAll(list);
    }

    @Override
    public String toString() {
        return "RecipeListDto{" +
                "recipes=" + categories +
                '}';
    }
}
