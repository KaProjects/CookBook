package org.kaleta.cookbook.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class EntityListItem extends AbstractEntity {

    @NotNull
    protected String id;

    @NotNull
    private String name;


    public EntityListItem(String id, String name) {
        setId(id);
        setName(name);
    }

    @Override
    public String toString() {
        return "EntityListItem{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
