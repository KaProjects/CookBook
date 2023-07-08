package org.kaleta.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.dto.RecipeDto;
import org.kaleta.entity.Ingredient;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.Step;
import org.kaleta.service.RecipeService;

import java.util.List;

@Path("/recipe")
public class RecipeResource {

    @Inject
    RecipeService service;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<RecipeDto> getAllRecipes() {
        List<Recipe> recipes = service.getRecipes();
        return RecipeDto.list(recipes);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public RecipeDto getRecipe(@PathParam("id") String id) {
        Recipe recipe = service.getRecipe(id);
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
            String newId = service.createRecipe(Recipe.from(recipeCreateDto));
            return Response
                    .status(201)
                    .type(MediaType.TEXT_PLAIN)
                    .entity(newId).build();
        } catch (Exception exception) {
            throw ErrorResponse.badRequest(exception.getMessage());
        }
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateRecipe(RecipeDto dto){
        Recipe recipe = service.getRecipe(dto.getId());
        if (recipe == null){
            throw ErrorResponse.notFound("Recipe with id='" + dto.getId() + "' not found!");
        }

        recipe.setName(dto.getName());
        recipe.setCategory(dto.getCategory());
        recipe.setImage(dto.getImage());

        recipe.getIngredients().clear();
        for (RecipeDto.IngredientDto ingredientDto : dto.getIngredients()){
            Ingredient ingredient = new Ingredient();
            ingredient.setIRecipe(recipe);
            ingredient.setName(ingredientDto.getName());
            ingredient.setQuantity(ingredientDto.getQuantity());
            ingredient.setOptional(ingredientDto.isOptional());
            recipe.getIngredients().add(ingredient);
        }

        recipe.getSteps().clear();
        for (RecipeDto.StepDto stepDto : dto.getSteps()){
            Step step = new Step();
            step.setSRecipe(recipe);
            step.setNumber(stepDto.getNumber());
            step.setText(stepDto.getText());
            step.setOptional(stepDto.isOptional());
            recipe.getSteps().add(step);
        }

        try {
            service.updateRecipe(recipe);
        } catch (Exception exception) {
            throw ErrorResponse.badRequest(exception.getMessage());
        }
    }
}
