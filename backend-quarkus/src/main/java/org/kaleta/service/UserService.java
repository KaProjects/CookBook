package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class UserService {

    public List<String> getUsers() {
        return Arrays.asList("Stanley", "Viktorka");
    }
}
