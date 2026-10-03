package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class StepDto
{
    /** Stored as a TINYINT. */
    @NotNull
    @Positive
    @Max(127)
    private Integer number;

    @NotBlank
    @Size(max = 10000)
    private String text;

    private boolean optional;
}
