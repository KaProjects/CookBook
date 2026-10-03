package org.kaleta.rest;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.kaleta.rest.dto.RecipeCreateDto;
import org.kaleta.rest.dto.RecipeDto;
import org.kaleta.rest.dto.RecipeUpdateDto;
import org.kaleta.rest.validation.ValidId;
import org.kaleta.service.RecipeService;

@Path("/recipe")
@Produces(MediaType.APPLICATION_JSON)
public class RecipeResource
{
    @Inject
    RecipeService recipeService;

    @GET
    @Path("/{id}")
    public RecipeDto get(@ValidId @PathParam("id") String id)
    {
        return recipeService.get(id);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid @NotNull RecipeCreateDto dto)
    {
        return Response.status(Response.Status.CREATED).entity(recipeService.create(dto)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public RecipeDto update(@ValidId @PathParam("id") String id, @Valid @NotNull RecipeUpdateDto dto)
    {
        return recipeService.update(id, dto);
    }
}
