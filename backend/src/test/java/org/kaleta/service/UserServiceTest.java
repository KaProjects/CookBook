package org.kaleta.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.kaleta.rest.dto.UserConfigDto;
import org.kaleta.rest.error.ResourceNotFoundException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@QuarkusTest
class UserServiceTest
{
    @Inject
    UserService userService;

    @Test
    void readsTheUsersFromTheClasspath()
    {
        // src/test/resources/users.json shadows the production file.
        assertThat(userService.getUsers(), contains("user", "user2", "user3", "writer"));
    }

    @Test
    void knowsWhoExists()
    {
        assertThat(userService.exists("user2"), is(true));
        assertThat(userService.exists("User2"), is(false));
        assertThat(userService.exists(null), is(false));
        assertDoesNotThrow(() -> userService.requireUser("user"));
        assertThrows(ResourceNotFoundException.class, () -> userService.requireUser("nobody"));
    }

    @Test
    void answersTheLayoutOfAKnownUser()
    {
        UserConfigDto config = userService.getConfig("user");

        assertThat(config.getMenuAnchor(), is(UserConfigDto.MenuAnchor.right));
        assertThat(config.getRecipeItemColor(), is("rgb(255,229,103)"));
        assertThrows(ResourceNotFoundException.class, () -> userService.getConfig("nobody"));
    }

    @Test
    void readsTheUsersFromAFile(@org.junit.jupiter.api.io.TempDir java.nio.file.Path directory) throws Exception
    {
        java.nio.file.Path file = directory.resolve("users.json");
        java.nio.file.Files.writeString(file, "{\"users\": [\"Anna\", \"Bob\"]}");
        UserService service = new UserService();
        service.usersResource = "file:" + file;

        assertThat(service.getUsers(), contains("Anna", "Bob"));

        service.usersResource = "file:" + directory.resolve("missing.json");
        service.users = null;
        assertThrows(IllegalStateException.class, service::getUsers);
    }

    @Test
    void namesAMissingUsersFile()
    {
        UserService service = new UserService();
        service.usersResource = "missing.json";

        assertThat(assertThrows(IllegalStateException.class, service::getUsers).getMessage(),
                is("'missing.json' does not exist"));
    }
}
