package org.kaleta.rest.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** What a cook can filter their recipes by, each list in alphabetical order. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class MenuDto
{
    private List<String> categories;
    private List<String> ingredients;
}
