package org.kaleta.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.kaleta.dto.UserConfigDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;

@QuarkusTest
class UserServiceTest
{
    @Inject
    UserService userService;

    @Test
    void getUsers_readsUsersJsonFromClasspath()
    {
        // src/test/resources/users.json shadows the production file.
        assertThat(userService.getUsers(), contains("user", "user2", "user3"));
    }

    @Test
    void getUserConfig_returnsConfiguredUser()
    {
        UserConfigDto config = userService.getUserConfig("Stanley");

        assertThat(config.getMenuAnchor(), is(UserConfigDto.MenuAnchor.right));
        assertThat(config.getRecipeItemColor(), is("rgb(255,229,103)"));
    }

    @Test
    void getUserConfig_fallsBackToDefaultForUnknownUser()
    {
        UserConfigDto config = userService.getUserConfig("nobody");

        assertThat(config.getMenuAnchor(), is(UserConfigDto.MenuAnchor.right));
        assertThat(config.getRecipeItemColor(), is("rgb(255,229,103)"));
    }

    @Test
    void getUserConfig_fallsBackToDefaultForNullUser()
    {
        assertThat(userService.getUserConfig(null).getMenuAnchor(), is(UserConfigDto.MenuAnchor.right));
    }
}
