package org.kaleta.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Ingredient")
public class Ingredient extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name ="recipeId", nullable = false)
    private Recipe iRecipe;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "quantity", nullable = false)
    private String quantity;

    @Column(name = "optional", nullable = false)
    private boolean optional;
}
