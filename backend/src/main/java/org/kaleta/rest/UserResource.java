package org.kaleta.rest;

import jakarta.inject.Inject;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.kaleta.rest.dto.MenuDto;
import org.kaleta.rest.dto.RecipeListDto;
import org.kaleta.rest.dto.UserConfigDto;
import org.kaleta.service.RecipeService;
import org.kaleta.service.UserService;

import java.util.List;

/** The users, and what belongs to each of them: their settings and their recipes. */
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource
{
    @Inject
    UserService userService;

    @Inject
    RecipeService recipeService;

    @GET
    public List<String> getUsers()
    {
        return userService.getUsers();
    }

    @GET
    @Path("/{user}/config")
    public UserConfigDto getConfig(@PathParam("user") String user)
    {
        return userService.getConfig(user);
    }

    /** The categories and ingredients the user's recipes can be filtered by. */
    @GET
    @Path("/{user}/menu")
    public MenuDto getMenu(@PathParam("user") String user)
    {
        return recipeService.getMenu(user);
    }

    /** The user's recipes by category, optionally only those of one category or using one ingredient. */
    @GET
    @Path("/{user}/recipes")
    public RecipeListDto getRecipes(@PathParam("user") String user,
                                    @Size(max = 100) @QueryParam("category") String category,
                                    @Size(max = 100) @QueryParam("ingredient") String ingredient)
    {
        return recipeService.list(user, category, ingredient);
    }
}
