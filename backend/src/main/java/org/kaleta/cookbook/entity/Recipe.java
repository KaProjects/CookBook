package org.kaleta.cookbook.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Recipe")
public class Recipe  extends AbstractEntity {

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "image")
    private String image;

    @ManyToOne(fetch = FetchType.EAGER/*, cascade = CascadeType.ALL*/) // TODO: bug1 - EntityNotFoundException: Unable to find
    @JoinColumn(name ="categoryId")
    @Setter(AccessLevel.NONE)
    @NotNull
    private Category category;

    @OneToMany(mappedBy="parent", cascade = CascadeType.ALL)
    @Setter(AccessLevel.NONE)
    private List<Step> stepList = new ArrayList<>();

    @OneToMany(mappedBy="recipe", cascade = CascadeType.ALL)
    @Setter(AccessLevel.NONE)
    private List<RecipeIngredient> recipeIngredientList = new ArrayList<>();


    /**
     * Category setter that also adds Recipe to Category.
     */
    public void setCategory(Category category) {
        this.category = category;
        category.getRecipeSet().add(this);
    }

    /**
     * Step setter that also adds Recipe to Step
     */
    public void addStep(Step step) {
        stepList.add(step);
        step.setParent(this);
    }

    /**
     * RecipeIngredient setter that also adds Recipe to RecipeIngredient
     */
    public void addRecipeIngredient(RecipeIngredient recipeIngredient) {
        recipeIngredientList.add(recipeIngredient);
        recipeIngredient.setRecipe(this);
    }

    @Override
    public String toString() {
        return "Recipe{" +
                "id='" + id + '\'' +
                " | name='" + name + '\'' +
                " | image=" + image +
                " | category=" + category.getName() +
                " | steps=" + stepList +
                " | recipeIngredientList=" + recipeIngredientList +
                '}';
    }
}
