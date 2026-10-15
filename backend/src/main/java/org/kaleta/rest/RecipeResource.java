package org.kaleta.rest;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.CacheControl;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.EntityTag;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Request;
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
    public RecipeDto get(@NotNull @ValidId @PathParam("id") Long id)
    {
        return recipeService.get(id);
    }

    /**
     * The recipe's picture, as stored or (size=thumbnail) scaled down for a list. A browser
     * revalidates it on every use and is answered 304 Not Modified until the picture changes.
     */
    @GET
    @Path("/{id}/image")
    @Produces({"image/jpeg", "image/png", MediaType.APPLICATION_OCTET_STREAM})
    public Response getImage(@NotNull @ValidId @PathParam("id") Long id,
                             @Pattern(regexp = "thumbnail|full") @QueryParam("size") String size,
                             @Context Request request)
    {
        RecipeService.RecipeImage image = recipeService.getImage(id, "thumbnail".equals(size));
        EntityTag tag = new EntityTag(image.tag());
        CacheControl cacheControl = new CacheControl();
        cacheControl.setPrivate(true);
        cacheControl.setNoCache(true);

        Response.ResponseBuilder notModified = request.evaluatePreconditions(tag);
        if (notModified != null) return notModified.tag(tag).cacheControl(cacheControl).build();
        return Response.ok(image.bytes(), image.mediaType()).tag(tag).cacheControl(cacheControl).build();
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
    public RecipeDto update(@NotNull @ValidId @PathParam("id") Long id, @Valid @NotNull RecipeUpdateDto dto)
    {
        return recipeService.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@NotNull @ValidId @PathParam("id") Long id)
    {
        recipeService.delete(id);
        return Response.noContent().build();
    }
}
