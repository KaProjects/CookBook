package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** How the frontend is laid out for a user. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class UserConfigDto
{
    private MenuAnchor menuAnchor;
    private String recipeItemColor;

    public enum MenuAnchor {left, right, top, bottom}
}
