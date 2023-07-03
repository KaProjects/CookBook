package org.kaleta.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Recipe")
public class Recipe extends AbstractEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "image", nullable = true)
    private String image;

    @Column(name = "uuser", nullable = false)
    private String user;

    @OneToMany(mappedBy="sRecipe", cascade = CascadeType.ALL)
    @Setter(AccessLevel.NONE)
    private List<Step> stepList = new ArrayList<>();

    @OneToMany(mappedBy="iRecipe", cascade = CascadeType.ALL)
    @Setter(AccessLevel.NONE)
    private List<Ingredient> ingredientList = new ArrayList<>();

}
