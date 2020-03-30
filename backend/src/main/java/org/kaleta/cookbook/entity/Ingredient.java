package org.kaleta.cookbook.entity;

import lombok.AccessLevel;
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
@Table(name = "Ingredient")
public class Ingredient extends AbstractEntity {

    @Column(name = "name")
    @NotNull
    private String name;


    @OneToMany(mappedBy="ingredient")
    @Setter(AccessLevel.NONE)
    private Set<RecipeIngredient> recipeIngredientSet = new HashSet<>();

    @Override
    public String toString() {
        return "Ingredient{" +
                "id=" + id +
                " | name='" + name + '\'' +
                " | recipeIngredients=" + recipeIngredientSet.size() +
                "}";
    }
}
