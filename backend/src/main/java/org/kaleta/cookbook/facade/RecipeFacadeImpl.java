package org.kaleta.cookbook.facade;

import org.kaleta.cookbook.dto.CreateRecipeDto;
import org.kaleta.cookbook.dto.CreateRecipeIngredientDto;
import org.kaleta.cookbook.dto.CreateRecipeStepDto;
import org.kaleta.cookbook.dto.RecipeDto;
import org.kaleta.cookbook.entity.Recipe;
import org.kaleta.cookbook.entity.RecipeIngredient;
import org.kaleta.cookbook.entity.Step;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.kaleta.cookbook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RecipeFacadeImpl implements RecipeFacade {

    @Autowired
    CategoryService categoryService;

    @Autowired
    IngredientService ingredientService;

    @Autowired
    RecipeService recipeService;

    @Autowired
    MappingService mappingService;

    @Override
    public List<RecipeDto> listAllRecipes() {
        return mappingService.mapToRecipeDtoList(recipeService.listAllRecipes());
    }

    @Override
    public List<RecipeDto> listRecipesByCategory(String categoryId) {
        return mappingService.mapToRecipeDtoList(recipeService.listRecipesByCategory(categoryId));
    }

    @Override
    public List<RecipeDto> listRecipesByIngredient(String ingredientId) {
        return mappingService.mapToRecipeDtoList(recipeService.listRecipesByIngredient(ingredientId));
    }

    @Override
    public String createRecipe(CreateRecipeDto createRecipeDto) {
        Recipe recipe = new Recipe();
        recipe.setName(createRecipeDto.getName());
        recipe.setImage(createRecipeDto.getImage());
        recipe.setCategory(categoryService.findCategory(createRecipeDto.getCategoryId()));
        for (CreateRecipeStepDto stepDto : createRecipeDto.getSteps()){
            Step step = new Step();
            step.setParent(recipe);
            step.setNumber(stepDto.getNumber());
            step.setText(stepDto.getText());
            step.setOptional(!stepDto.isMandatory());
            recipe.getStepList().add(step);
        }
        for (CreateRecipeIngredientDto ingredientDto : createRecipeDto.getIngredients()){
            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setRecipe(recipe);
            recipeIngredient.setUnit(ingredientDto.getUnit());
            recipeIngredient.setQuantity(ingredientDto.getQuantity());
            recipeIngredient.setOptional(!ingredientDto.isMandatory());
            recipeIngredient.setIngredient(ingredientService.findIngredient(ingredientDto.getIngredientId()));
            recipe.getRecipeIngredientList().add(recipeIngredient);
        }
        return recipeService.createRecipe(recipe);
    }
}
