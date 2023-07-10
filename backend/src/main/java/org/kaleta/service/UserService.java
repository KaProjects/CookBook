package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.kaleta.dto.UserConfigDto;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class UserService {

    private final List<String> users = Arrays.asList("Stanley", "Viktorka");
    private final Map<String, UserConfigDto> configs = new HashMap<>() {{
        put("Stanley", new UserConfigDto(UserConfigDto.MenuAnchor.right, "rgb(255,229,103)"));
        put("Viktorka", new UserConfigDto(UserConfigDto.MenuAnchor.left, "rgb(255,215,0)"));
    }};

    public List<String> getUsers() {
        return users;
    }

    public UserConfigDto getUserConfig(String user) {
        return configs.get(user);
    }
}
