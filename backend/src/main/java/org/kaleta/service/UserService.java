package org.kaleta.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.kaleta.rest.dto.UserConfigDto;
import org.kaleta.rest.error.ResourceNotFoundException;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * The users of the cookbook, each of them a cook with recipes of their own.
 * <p>
 * They are read from a JSON resource on the classpath: users.json in production, which is
 * encrypted with git-crypt, and a throwaway file in development, so the application runs from a
 * clone that cannot decrypt it. A {@code file:} path reads a file instead, so a deployment can
 * change its users without a new build.
 */
@ApplicationScoped
public class UserService
{
    private static final UserConfigDto DEFAULT_CONFIG = new UserConfigDto(UserConfigDto.MenuAnchor.right, "rgb(255,229,103)");

    private static final String FILE_PREFIX = "file:";

    @ConfigProperty(name = "users.resource", defaultValue = "users.json")
    String usersResource;

    volatile List<String> users;

    public List<String> getUsers()
    {
        if (users == null) users = readUsers();
        return users;
    }

    public boolean exists(String user)
    {
        return user != null && getUsers().contains(user);
    }

    /** @throws ResourceNotFoundException when there is no such user */
    public void requireUser(String user)
    {
        if (!exists(user)) throw new ResourceNotFoundException("User '" + user + "' does not exist.");
    }

    public UserConfigDto getConfig(String user)
    {
        requireUser(user);
        return DEFAULT_CONFIG;
    }

    /**
     * A missing resource is reported by name: a native image embeds only the resources it is
     * configured to, and without that the stream is simply null.
     */
    private List<String> readUsers()
    {
        try (InputStream stream = open(usersResource)) {
            if (stream == null) throw new IllegalStateException("'" + usersResource + "' does not exist");
            return List.copyOf(new ObjectMapper().readValue(stream, Users.class).users());
        } catch (IOException e) {
            throw new UncheckedIOException("could not read '" + usersResource + "'", e);
        }
    }

    private static InputStream open(String resource) throws IOException
    {
        if (resource.startsWith(FILE_PREFIX)) {
            Path file = Path.of(resource.substring(FILE_PREFIX.length()));
            return Files.exists(file) ? Files.newInputStream(file) : null;
        }
        return Thread.currentThread().getContextClassLoader().getResourceAsStream(resource);
    }

    /** The shape of the users file. Registered, as a native image reads it by reflection. */
    @RegisterForReflection
    public record Users(List<String> users) {}
}
