package org.kaleta.dto;

import lombok.Data;

@Data
public class UserConfigDto {

    private MenuAnchor menuAnchor;
    private String recipeItemColor;

    public UserConfigDto(MenuAnchor menuAnchor, String recipeItemColor){
        this.menuAnchor = menuAnchor;
        this.recipeItemColor = recipeItemColor;
    }

    public enum MenuAnchor {left, right, top, bottom}
}
