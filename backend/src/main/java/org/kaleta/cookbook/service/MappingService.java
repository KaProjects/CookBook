package org.kaleta.cookbook.service;

import org.dozer.Mapper;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.Recipe;

import java.util.Collection;
import java.util.List;

public interface MappingService {

    <T> List<T> mapTo(Collection<?> objects, Class<T> mapToClass);

    <T> T mapTo(Object u, Class<T> mapToClass);

    Mapper getMapper();

    RecipeDto mapToRecipeDto(Recipe recipe);

    List<RecipeDto> mapToRecipeDtoList(List<Recipe> recipeList);

//    Recipe mapToRecipe(RecipeDto recipeDto);

//    RecipeDto mapToIngredientDto(Ingredient ingredient);
//
//    List<RecipeDto> mapToIngredientDtoList(List<Ingredient> ingredientList);
}
