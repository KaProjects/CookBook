package org.kaleta.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.kaleta.dto.MenuListDto;
import org.kaleta.dto.RecipeListByCategoryDto;
import org.kaleta.dto.RecipeListDto;
import org.kaleta.entity.RecipeListItem;
import org.kaleta.service.ListService;

import java.util.List;
import java.util.Map;

@Path("/list")
public class ListResource {

    @Inject
    ListService service;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{cook}/menu")
    public MenuListDto getMenuList(@PathParam("cook") String cook) {
        MenuListDto dto = new MenuListDto();
        dto.getIngredients().addAll(service.listIngredients(cook));
        dto.getCategories().addAll(service.listCategories(cook));
        return dto;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{cook}/recipe")
    public RecipeListDto getRecipeList(@PathParam("cook") String cook,
                                       @QueryParam("category") String category,
                                       @QueryParam("ingredient") String ingredient) {

        RecipeListDto dto = new RecipeListDto();

        if (category == null && ingredient == null) {
            dto.getRecipes().addAll(service.listRecipes(cook));
        } else {
            dto.getRecipes().addAll(service.listRecipes(cook, category, ingredient));
        }

        return dto;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{cook}/category")
    public RecipeListByCategoryDto getRecipeListByCategory(@PathParam("cook") String cook) {
        Map<String, List<RecipeListItem>> categoryMap = service.listRecipesByCategory(cook);
        return RecipeListByCategoryDto.from(categoryMap);
    }
}
