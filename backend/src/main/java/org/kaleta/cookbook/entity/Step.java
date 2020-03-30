package org.kaleta.cookbook.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Entity
@Table(name = "Step")
public class Step extends AbstractEntity{

    @ManyToOne
    @JoinColumn(name ="recipeId")
    @NotNull
    private Recipe parent;

    @Column(name = "number")
    @NotNull
    private Integer number;

    @Column(name = "text")
    @NotNull
    private String text;

    @Column(name = "optional")
    @NotNull
    private Boolean optional;

    @Override
    public String toString() {
        return "Step{" +
                "id=" + id +
                " | number=" + number +
                " | text='" + text + '\'' +
                " | optional=" + optional +
                '}';
    }
}
