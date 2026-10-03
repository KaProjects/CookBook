package org.kaleta.persistence.entity;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Every table is keyed by a UUID string assigned on creation, so an entity has its identity
 * before it is persisted and the steps and ingredients of a new recipe can be linked to it at once.
 */
@Getter
@Setter
@MappedSuperclass
@EqualsAndHashCode(of = "id")
public abstract class AbstractEntity
{
    @Id
    protected String id = UUID.randomUUID().toString();

    @Override
    public String toString()
    {
        return getClass().getSimpleName() + "@" + id;
    }
}
