package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.kaleta.rest.validation.ValidUser;

@Data
@EqualsAndHashCode(callSuper = true)
@RegisterForReflection
public class RecipeCreateDto extends RecipeUpdateDto
{
    @ValidUser
    private String cook;
}
