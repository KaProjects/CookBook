package org.kaleta.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Step")
public class Step extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name ="recipeId", nullable = false)
    private Recipe sRecipe;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "optional", nullable = false)
    private boolean optional;
}
