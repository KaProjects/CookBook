package org.kaleta.entity;

import lombok.Data;

@Data
public class EntityListItem {

    private String name;
    private String id;

    public EntityListItem(String id, String name){
        this.id = id;
        this.name = name;
    }

    public EntityListItem() {

    }
}
