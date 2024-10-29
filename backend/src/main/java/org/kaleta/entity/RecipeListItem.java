package org.kaleta.entity;

import lombok.Data;

@Data
public class RecipeListItem
{

    private String id;
    private String name;
    private String category;
    private Boolean hasImage;
    private Boolean hasSteps;

    public RecipeListItem(String id, String name){
        this.id = id;
        this.name = name;
    }

    public RecipeListItem() {

    }
}
