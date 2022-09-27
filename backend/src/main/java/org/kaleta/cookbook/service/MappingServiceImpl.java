package org.kaleta.cookbook.service;

import org.dozer.Mapper;
import org.kaleta.cookbook.dto.CategoryDto;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class MappingServiceImpl implements MappingService{

    @Autowired
    private Mapper dozer;

    public  <T> List<T> mapTo(Collection<?> objects, Class<T> mapToClass) {
        List<T> mappedCollection = new ArrayList<>();
        for (Object object : objects) {
            mappedCollection.add(dozer.map(object, mapToClass));
        }
        return mappedCollection;
    }

    public  <T> T mapTo(Object u, Class<T> mapToClass)
    {
        return dozer.map(u,mapToClass);
    }

    public Mapper getMapper(){
        return dozer;
    }

    @Override
    public RecipeDto mapToRecipeDto(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setId(recipe.getId());
        recipeDto.setName(recipe.getName());
        recipeDto.setImage(recipe.getImage());

        CategoryDto category = new CategoryDto();
        category.setId(recipe.getCategory().getId());
        category.setName(recipe.getCategory().getName());
        recipeDto.setCategory(category);

        for (RecipeIngredient recipeIngredient : recipe.getRecipeIngredientList()){
            RecipeDto.RecipeIngredientDto ingredient = new RecipeDto.RecipeIngredientDto();
            ingredient.setId(recipeIngredient.getIngredient().getId());
            ingredient.setName(recipeIngredient.getIngredient().getName());
            ingredient.setQuantity(recipeIngredient.getQuantity());
            ingredient.setUnit(recipeIngredient.getUnit());
            ingredient.setOptional(recipeIngredient.isOptional());
            recipeDto.getIngredients().add(ingredient);
        }
        for (Step recipeStep : recipe.getStepList()){
            RecipeDto.RecipeStepDto step = new RecipeDto.RecipeStepDto();
            step.setNumber(recipeStep.getNumber());
            step.setText(recipeStep.getText());
            step.setOptional(recipeStep.isOptional());
            recipeDto.getSteps().add(step);
        }
        return recipeDto;
    }

    @Override
    public Recipe mapToRecipe(RecipeDto recipeDto) {
        Recipe recipe = new Recipe();
        if (recipeDto.getId() != null) recipe.setId(recipeDto.getId());
        recipe.setName(recipeDto.getName());
        recipe.setImage(recipeDto.getImage());
        Category category = new Category();
        category.setId(recipeDto.getCategory().getId());
        category.setName(recipeDto.getCategory().getName());
        recipe.setCategory(category);

        for (RecipeDto.RecipeIngredientDto ingredient : recipeDto.getIngredients()){
            RecipeIngredient recipeIngredient = new RecipeIngredient();

            Ingredient recipeIngredientIngredient = new Ingredient();
            recipeIngredientIngredient.setId(ingredient.getId());
            recipeIngredientIngredient.setName(ingredient.getName());
            recipeIngredient.setIngredient(recipeIngredientIngredient);

            recipeIngredient.setRecipe(recipe);

            recipeIngredient.setQuantity(ingredient.getQuantity());
            recipeIngredient.setUnit(ingredient.getUnit());
            recipeIngredient.setOptional(ingredient.isOptional());
            recipe.getRecipeIngredientList().add(recipeIngredient);
        }
        for (RecipeDto.RecipeStepDto recipeStep : recipeDto.getSteps()){
            Step step = new Step();
            step.setNumber(recipeStep.getNumber());
            step.setText(recipeStep.getText());
            step.setOptional(recipeStep.isOptional());
            step.setParent(recipe);

            recipe.getStepList().add(step);
        }
        return recipe;
    }

    @Override
    public List<RecipeDto> mapToRecipeDtoList(List<Recipe> recipeList) {
        List<RecipeDto> recipeDtoList = new ArrayList<>();
        for (Recipe recipe : recipeList){
            recipeDtoList.add(mapToRecipeDto(recipe));
        }
        return recipeDtoList;
    }

//    @Override
//    public RecipeDto mapToIngredientDto(Ingredient ingredient) {
//        IngredientDto dto = new IngredientDto();
//
//
//        return dto
//    }
//
//    @Override
//    public List<RecipeDto> mapToIngredientDtoList(List<Ingredient> ingredientList) {
//        List<RecipeDto> dtoList = new ArrayList<>();
//        for (Ingredient ingredient : ingredientList){
//            dtoList.add(mapTo(ingredient));
//        }
//        return dtoList;
//    }
}
