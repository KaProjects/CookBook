package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class IngredientDto
{
    @NotBlank
    @Size(max = 100)
    private String name;

    /** Free text such as "2 pcs" or "a pinch"; may be empty, but the column is VARCHAR(30). */
    @NotNull
    @Size(max = 30)
    private String quantity;

    private boolean optional;
}
