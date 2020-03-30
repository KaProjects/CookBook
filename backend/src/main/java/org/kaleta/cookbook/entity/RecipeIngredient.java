package org.kaleta.cookbook.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Entity
@Table(name = "RecipeIngredient")
public class RecipeIngredient  extends AbstractEntity{

    @ManyToOne
    @JoinColumn(name = "recipeId")
    //@NotNull - technically, can be null, while it's only realization of Ingredient, not yet assigned to Recipe.
    private Recipe recipe;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ingredientId")
    @Setter(AccessLevel.NONE)
    @NotNull
    private Ingredient ingredient;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "unit")
    @NotNull
    private String unit;

    @Column(name = "optional")
    @NotNull
    private Boolean optional;

    public void setIngredient(Ingredient ingredient){
        ingredient.getRecipeIngredientSet().add(this);
        this.ingredient = ingredient;

    }

    @Override
    public String toString() {
        return "RecipeIngredient{" +
                "id='" + id + '\'' +
                " | recipe=" + recipe.getName() +
                " | ingredient=" + (ingredient != null ? ingredient.getName() : "NULL") +
                " | quantity=" + quantity +
                " | unit='" + unit + '\'' +
                " | optional=" + optional +
                '}';
    }
}
