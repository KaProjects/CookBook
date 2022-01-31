package org.kaleta.cookbook.service;

import org.dozer.Mapper;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.entity.RecipeIngredient;
import org.kaleta.cookbook.entity.Step;
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
        recipeDto.setCategory(recipe.getCategory().getName());

        for (RecipeIngredient recipeIngredient : recipe.getRecipeIngredientList()){
            RecipeDto.Ingredient ingredient = new RecipeDto.Ingredient();
            ingredient.setName(recipeIngredient.getIngredient().getName());
            ingredient.setQuantity(recipeIngredient.getQuantity());
            ingredient.setUnit(recipeIngredient.getUnit());
            ingredient.setOptional(recipeIngredient.isOptional());
            recipeDto.getIngredients().add(ingredient);
        }
        for (Step recipeStep : recipe.getStepList()){
            RecipeDto.Step step = new RecipeDto.Step();
            step.setNumber(recipeStep.getNumber());
            step.setText(recipeStep.getText());
            step.setOptional(recipeStep.isOptional());
            recipeDto.getSteps().add(step);
        }
        return recipeDto;
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
