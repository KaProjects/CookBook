package org.kaleta.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.kaleta.service.UserService;

import java.util.List;

@Path("/user")
public class UserResource {

    @Inject
    UserService service;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getUsers() {
        return service.getUsers();
    }
}
