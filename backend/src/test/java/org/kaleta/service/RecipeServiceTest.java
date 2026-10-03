package org.kaleta.service;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.kaleta.framework.Generator;
import org.kaleta.persistence.api.RecipeDao;
import org.kaleta.persistence.entity.Recipe;
import org.kaleta.persistence.entity.RecipeSummary;
import org.kaleta.rest.dto.IngredientDto;
import org.kaleta.rest.dto.MenuDto;
import org.kaleta.rest.dto.RecipeCreateDto;
import org.kaleta.rest.dto.RecipeDto;
import org.kaleta.rest.dto.RecipeListDto;
import org.kaleta.rest.dto.RecipeUpdateDto;
import org.kaleta.rest.dto.StepDto;
import org.kaleta.rest.error.ResourceNotFoundException;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
class RecipeServiceTest
{
    @InjectMock
    RecipeDao recipeDao;

    @InjectMock
    ImageService imageService;

    @InjectMock
    UserService userService;

    @Inject
    RecipeService recipeService;

    @BeforeEach
    void knownUsers()
    {
        when(imageService.toJpeg(anyString())).thenAnswer(invocation -> "jpeg:" + invocation.getArgument(0));
    }

    @Test
    void get_mapsTheRecipeWithStepsInOrder()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage("img");
        Generator.step(recipe, 2, "boil");
        Generator.step(recipe, 1, "chop");
        Generator.ingredient(recipe, "Water", "1 l").setOptional(true);
        when(recipeDao.find(recipe.getId())).thenReturn(Optional.of(recipe));

        RecipeDto dto = recipeService.get(recipe.getId());

        assertThat(dto.getId(), is(recipe.getId()));
        assertThat(dto.getCook(), is("cook"));
        assertThat(dto.getName(), is("Soup"));
        assertThat(dto.getCategory(), is("Soups"));
        assertThat(dto.getImage(), is("img"));
        assertThat(dto.getSteps(), contains(new StepDto(1, "chop", false), new StepDto(2, "boil", false)));
        assertThat(dto.getIngredients(), contains(new IngredientDto("Water", "1 l", true)));
    }

    @Test
    void get_unknownRecipeIsNotFound()
    {
        when(recipeDao.find("missing")).thenReturn(Optional.empty());

        assertThat(assertThrows(ResourceNotFoundException.class, () -> recipeService.get("missing")).getMessage(),
                is("Recipe 'missing' does not exist."));
    }

    @Test
    void create_buildsTheRecipeAndLinksItsChildren()
    {
        RecipeCreateDto dto = Generator.createDto("cook");
        dto.setName("  Soup ");
        dto.getIngredients().set(0, new IngredientDto(" Salt ", " 1 pinch ", false));

        RecipeDto created = recipeService.create(dto);

        ArgumentCaptor<Recipe> captor = ArgumentCaptor.forClass(Recipe.class);
        verify(recipeDao).create(captor.capture());
        Recipe recipe = captor.getValue();
        assertThat(recipe.getCook(), is("cook"));
        assertThat(recipe.getName(), is("Soup"));
        assertThat(recipe.getImage(), is(nullValue()));
        assertThat(recipe.getIngredients().get(0).getName(), is("Salt"));
        assertThat(recipe.getIngredients().get(0).getQuantity(), is("1 pinch"));
        recipe.getSteps().forEach(step -> assertThat(step.getRecipe(), is(sameInstance(recipe))));
        recipe.getIngredients().forEach(ingredient -> assertThat(ingredient.getRecipe(), is(sameInstance(recipe))));
        assertThat(created.getId(), is(recipe.getId()));
        verify(imageService, never()).toJpeg(any());
    }

    @Test
    void create_numbersStepsByTheirOrder()
    {
        RecipeCreateDto dto = Generator.createDto("cook");
        dto.setSteps(List.of(new StepDto(9, "c", false), new StepDto(2, "a", false), new StepDto(5, "b", true)));

        RecipeDto created = recipeService.create(dto);

        assertThat(created.getSteps(), contains(new StepDto(1, "a", false), new StepDto(2, "b", true), new StepDto(3, "c", false)));
    }

    @Test
    void create_convertsTheImage()
    {
        RecipeCreateDto dto = Generator.createDto("cook");
        dto.setImage("data:image/png;base64,AA==");

        assertThat(recipeService.create(dto).getImage(), is("jpeg:data:image/png;base64,AA=="));
    }

    @Test
    void update_replacesTheChildrenAndSaves()
    {
        Recipe recipe = Generator.recipe("cook", "Old", "Old category");
        Generator.step(recipe, 1, "old step");
        Generator.ingredient(recipe, "Old ingredient", "1");
        when(recipeDao.find(recipe.getId())).thenReturn(Optional.of(recipe));
        when(recipeDao.save(recipe)).thenReturn(recipe);
        RecipeUpdateDto dto = Generator.updateDto();

        RecipeDto updated = recipeService.update(recipe.getId(), dto);

        verify(recipeDao).save(recipe);
        assertThat(recipe.getName(), is("Generated Recipe"));
        assertThat(recipe.getCook(), is("cook"));
        assertThat(recipe.getSteps().stream().map(step -> step.getText()).toList(), contains("first step", "second step"));
        assertThat(recipe.getIngredients().stream().map(ingredient -> ingredient.getName()).toList(), contains("Salt", "Pepper"));
        assertThat(updated.getName(), is("Generated Recipe"));
    }

    @Test
    void update_onlyConvertsANewImage()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage("data:image/jpeg;base64,stored");
        when(recipeDao.find(recipe.getId())).thenReturn(Optional.of(recipe));
        when(recipeDao.save(recipe)).thenReturn(recipe);
        RecipeUpdateDto dto = Generator.updateDto();

        dto.setImage("data:image/jpeg;base64,stored");
        recipeService.update(recipe.getId(), dto);
        verify(imageService, never()).toJpeg(any());
        assertThat(recipe.getImage(), is("data:image/jpeg;base64,stored"));

        dto.setImage("data:image/png;base64,new");
        recipeService.update(recipe.getId(), dto);
        assertThat(recipe.getImage(), is("jpeg:data:image/png;base64,new"));

        dto.setImage(null);
        recipeService.update(recipe.getId(), dto);
        assertThat(recipe.getImage(), is(nullValue()));
    }

    @Test
    void update_unknownRecipeIsNotFound()
    {
        when(recipeDao.find("missing")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> recipeService.update("missing", Generator.updateDto()));
        verify(recipeDao, never()).save(any());
    }

    @Test
    void getMenu_sortsTheSlovakWay()
    {
        when(recipeDao.listCategories("cook")).thenReturn(List.of("Šaláty", "Polievky", "Cestoviny", "Čaje"));
        when(recipeDao.listIngredients("cook")).thenReturn(List.of("Zemiaky", "Cibuľa", "chlieb", "Hrach"));

        MenuDto menu = recipeService.getMenu("cook");

        verify(userService).requireUser("cook");
        assertThat(menu.getCategories(), contains("Cestoviny", "Čaje", "Polievky", "Šaláty"));
        // In Slovak "ch" is a letter of its own, sorted after "h".
        assertThat(menu.getIngredients(), contains("Cibuľa", "Hrach", "chlieb", "Zemiaky"));
    }

    @Test
    void list_groupsByCategoryInOrder()
    {
        when(recipeDao.listSummaries("cook", null, null)).thenReturn(List.of(
                new RecipeSummary("1", "Paradajková", "Polievky", false, true),
                new RecipeSummary("2", "Guláš", "Hlavné jedlá", true, true),
                new RecipeSummary("3", "Kapustnica", "Polievky", true, false)));

        RecipeListDto list = recipeService.list("cook", null, null);

        verify(userService).requireUser("cook");
        assertThat(list.getCategories().stream().map(RecipeListDto.Category::getName).toList(), contains("Hlavné jedlá", "Polievky"));
        assertThat(list.getCategories().get(1).getRecipes(), contains(
                new RecipeListDto.Item("3", "Kapustnica", true, false),
                new RecipeListDto.Item("1", "Paradajková", false, true)));
    }

    @Test
    void list_passesTheFiltersOn()
    {
        when(recipeDao.listSummaries("cook", "Polievky", "Soľ")).thenReturn(List.of());

        assertThat(recipeService.list("cook", "Polievky", "Soľ").getCategories(), is(List.of()));
        verify(recipeDao).listSummaries("cook", "Polievky", "Soľ");
    }

    @Test
    void unknownUsersAreRefusedBeforeTheDatabaseIsAsked()
    {
        org.mockito.Mockito.doThrow(new ResourceNotFoundException("no")).when(userService).requireUser("ghost");

        assertThrows(ResourceNotFoundException.class, () -> recipeService.getMenu("ghost"));
        assertThrows(ResourceNotFoundException.class, () -> recipeService.list("ghost", null, null));
        verify(recipeDao, never()).listCategories(any());
        verify(recipeDao, never()).listSummaries(any(), any(), any());
    }
}
