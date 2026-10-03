package org.kaleta.persistence.entity;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * One row of a cook's recipe list: enough to show and filter it, without loading the steps,
 * ingredients or the image itself.
 * <p>
 * Hibernate builds it by reflection from a JPQL constructor expression, which a native image only
 * allows for a class registered for it.
 */
@RegisterForReflection
public record RecipeSummary(String id, String name, String category, boolean hasImage, boolean hasSteps)
{
}
