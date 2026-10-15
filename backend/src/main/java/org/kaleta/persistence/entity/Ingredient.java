package org.kaleta.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Ingredient")
public class Ingredient extends AbstractEntity
{
    @ManyToOne
    @JoinColumn(name = "recipeId", nullable = false)
    private Recipe recipe;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "quantity", nullable = false)
    private String quantity;

    @Column(name = "optional", nullable = false)
    private boolean optional;
}
