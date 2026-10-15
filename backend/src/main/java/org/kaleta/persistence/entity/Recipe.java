package org.kaleta.persistence.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Recipe")
public class Recipe extends AbstractEntity
{
    @Column(name = "cook", nullable = false)
    private String cook;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", nullable = false)
    private String category;

    /** A data URL, "data:image/jpeg;base64,...", stored in a LONGBLOB column. */
    @Column(name = "image")
    private String image;

    /**
     * Owned by the recipe: replacing the list replaces the rows, as the steps of a recipe have no
     * life of their own. Without orphan removal, an update had to delete the whole recipe and
     * merge it back in to get rid of the steps that were left out.
     */
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("number")
    @Setter(AccessLevel.NONE)
    private List<Step> steps = new ArrayList<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter(AccessLevel.NONE)
    private List<Ingredient> ingredients = new ArrayList<>();

    public void addStep(Step step)
    {
        step.setRecipe(this);
        steps.add(step);
    }

    public void addIngredient(Ingredient ingredient)
    {
        ingredient.setRecipe(this);
        ingredients.add(ingredient);
    }
}
