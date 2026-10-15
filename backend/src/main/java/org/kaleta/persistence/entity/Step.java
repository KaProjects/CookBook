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
@Table(name = "Step")
public class Step extends AbstractEntity
{
    @ManyToOne
    @JoinColumn(name = "recipeId", nullable = false)
    private Recipe recipe;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "optional", nullable = false)
    private boolean optional;
}
