package org.kaleta;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.junit.jupiter.api.Test;
import org.kaleta.persistence.entity.RecipeSummary;
import org.kaleta.rest.dto.RecipeDto;
import org.kaleta.rest.error.Problem;
import org.kaleta.service.UserService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;

/**
 * A native image writes and reads JSON by reflection and keeps only the metadata it was told to
 * keep. A class crossing the REST boundary without the annotation serialises as an empty object
 * in the native production binary while every test on the JVM keeps passing, because the JVM
 * needs no such metadata - so checking that the annotation is present is the guard we have.
 * <p>
 * The annotation does not reach nested classes, so each one is checked in its own right.
 */
class NativeReflectionTest
{
    @Test
    void everyTypeCrossingTheRestBoundaryIsRegisteredForReflection() throws Exception
    {
        List<Class<?>> unregistered = new ArrayList<>();
        for (Class<?> type : typesCrossingTheRestBoundary()) {
            if (!type.isAnnotationPresent(RegisterForReflection.class)) unregistered.add(type);
        }
        assertThat("these serialise as '{}' in the native image: " + unregistered, unregistered, is(empty()));
    }

    /**
     * Everything in the dto package, plus the problem details every error is answered with and
     * the users file and the recipe list rows read by reflection.
     */
    private List<Class<?>> typesCrossingTheRestBoundary() throws Exception
    {
        List<Class<?>> types = new ArrayList<>(List.of(Problem.class, Problem.Violation.class, UserService.Users.class, RecipeSummary.class));

        // Anchored on a known class so this reads the compiled main classes.
        Path dtoDirectory = Path.of(RecipeDto.class.getResource("RecipeDto.class").toURI()).getParent();
        try (Stream<Path> files = Files.list(dtoDirectory)) {
            for (Path file : files.sorted().toList()) {
                String name = file.getFileName().toString();
                if (!name.endsWith(".class")) continue;
                String simpleName = name.substring(0, name.length() - ".class".length());
                if (simpleName.matches(".*\\$\\d+")) continue; // anonymous, never serialised
                Class<?> type = Class.forName(RecipeDto.class.getPackageName() + "." + simpleName);
                if (!type.isEnum()) types.add(type);
            }
        }
        return types;
    }
}
