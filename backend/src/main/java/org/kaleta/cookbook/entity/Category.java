package org.kaleta.cookbook.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Category")
public class Category extends AbstractEntity{

    @Column(name = "name")
    @NotNull
    private String name;

    @OneToMany(mappedBy="category")
    private Set<Recipe> recipeSet = new HashSet<>();

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                " | name='" + name + '\'' +
                " | recipes=" + recipeSet.size() +
                "}";
    }
}
