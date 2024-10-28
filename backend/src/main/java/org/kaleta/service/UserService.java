package org.kaleta.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import org.kaleta.dto.UserConfigDto;
import org.kaleta.entity.Users;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class UserService {

    private final Map<String, UserConfigDto> configs = new HashMap<>() {{
        put("Stanley", new UserConfigDto(UserConfigDto.MenuAnchor.right, "rgb(255,229,103)"));
    }};

    public List<String> getUsers() {
        try(InputStream inputStream =Thread.currentThread().getContextClassLoader().getResourceAsStream("users.json")){
            ObjectMapper mapper = new ObjectMapper();
            Users users = mapper.readValue(inputStream , Users.class);
            return users.getUsers();
        }
        catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    public UserConfigDto getUserConfig(String user) {
        return configs.get(user);
    }
}
