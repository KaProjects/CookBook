package org.kaleta.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.kaleta.dto.RecipeDto;
import org.kaleta.service.RecipeService;

@Path("/recipe")
public class RecipeResource {

    @Inject
    RecipeService recipeService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public RecipeDto getRecipe(@PathParam("id") String id) {
        // TODO: 03.07.2023 check null and return 404 response
        return recipeService.getRecipe(id);
    }
}
