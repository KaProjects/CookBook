package org.kaleta.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.kaleta.dto.MenuListDto;
import org.kaleta.dto.RecipeListDto;
import org.kaleta.entity.EntityListItem;
import org.kaleta.service.ListService;

import java.util.ArrayList;
import java.util.List;

@Path("/list")
public class ListResource {

    @Inject
    ListService listService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{cook}/menu")
    public MenuListDto getMenuList(@PathParam("cook") String cook) {
        MenuListDto dto = new MenuListDto();
        dto.getIngredients().addAll(listService.listIngredients(cook));
        dto.getCategories().addAll(listService.listCategories(cook));
        return dto;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{cook}/recipe")
    public RecipeListDto getRecipeList(@PathParam("cook") String cook,
                                       @QueryParam("category") String category) {

        List<EntityListItem> items = new ArrayList<>();

        if (category == null){
            items.addAll(listService.listRecipes(cook));
        } else {
            items.addAll(listService.listRecipes(cook, category));
        }

        RecipeListDto dto = new RecipeListDto();
        dto.getRecipes().addAll(items);
        return dto;
    }
}
