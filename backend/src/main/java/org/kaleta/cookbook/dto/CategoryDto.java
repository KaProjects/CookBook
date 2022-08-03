package org.kaleta.cookbook.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class CategoryDto {

    private String id;

    private String name;


    @Override
    public String toString() {
        return "\nCategoryDto{" +
                "\nid='" + id + '\'' +
                "\nname='" + name + '\'' +
                "\n}";
    }
}
