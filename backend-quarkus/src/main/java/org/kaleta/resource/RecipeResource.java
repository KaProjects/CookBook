package org.kaleta.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.dto.RecipeDto;
import org.kaleta.entity.Recipe;
import org.kaleta.service.RecipeService;

import java.util.List;

@Path("/recipe")
public class RecipeResource {

    @Inject
    RecipeService recipeService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<RecipeDto> getAllRecipes() {
        List<Recipe> recipes = recipeService.getRecipes();
        return RecipeDto.list(recipes);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public RecipeDto getRecipe(@PathParam("id") String id) {
        Recipe recipe = recipeService.getRecipe(id);
        if (recipe == null){
            throw ErrorResponse.notFound("Recipe with id='" + id + "' not found!");
        } else {
            return RecipeDto.from(recipe);
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response createRecipe(RecipeCreateDto recipeCreateDto){
        try {
            String newId = recipeService.createRecipe(Recipe.from(recipeCreateDto));
            return Response
                    .status(201)
                    .type(MediaType.TEXT_PLAIN)
                    .entity(newId).build();
        } catch (Exception exception) {
            throw ErrorResponse.badRequest(exception.getMessage());
        }
    }
}
