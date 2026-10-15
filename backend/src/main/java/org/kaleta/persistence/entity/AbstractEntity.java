package org.kaleta.persistence.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

/**
 * Every table is keyed by an INT UNSIGNED AUTO_INCREMENT the database assigns, as in the Trading
 * web project. They used to be UUID strings: 36 characters in every URL and every foreign key.
 * <p>
 * Equality is identity. An entity has no ID until it is saved, so equality by ID would make every
 * new step of a recipe equal to every other.
 */
@Getter
@Setter
@MappedSuperclass
public abstract class AbstractEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Override
    public String toString()
    {
        return getClass().getSimpleName() + "@" + id;
    }
}
