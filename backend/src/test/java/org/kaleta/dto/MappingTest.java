package org.kaleta.dto;

import org.junit.jupiter.api.Test;
import org.kaleta.entity.Ingredient;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.RecipeListItem;
import org.kaleta.entity.Step;
import org.kaleta.framework.Generator;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.sameInstance;

/**
 * Plain unit tests for the DTO <-> entity conversions; no Quarkus needed.
 */
class MappingTest
{
    @Test
    void recipeFromCreateDto_copiesFieldsAndLinksChildrenBack()
    {
        RecipeCreateDto dto = Generator.recipeCreateDto("cook");
        dto.setImage("data:image/png;base64,AA==");

        Recipe recipe = Recipe.from(dto);

        assertThat(recipe.getCook(), is("cook"));
        assertThat(recipe.getName(), is("Generated Recipe"));
        assertThat(recipe.getCategory(), is("Generated Category"));
        assertThat(recipe.getImage(), is("data:image/png;base64,AA=="));
        assertThat(recipe.getId(), is(notNullValue()));

        assertThat(recipe.getSteps(), hasSize(2));
        Step second = recipe.getSteps().get(1);
        assertThat(second.getNumber(), is(2));
        assertThat(second.getText(), is("second step"));
        assertThat(second.isOptional(), is(true));
        assertThat(second.getSRecipe(), is(sameInstance(recipe)));

        assertThat(recipe.getIngredients(), hasSize(2));
        Ingredient first = recipe.getIngredients().get(0);
        assertThat(first.getName(), is("Salt"));
        assertThat(first.getQuantity(), is("1 pinch"));
        assertThat(first.isOptional(), is(false));
        assertThat(first.getIRecipe(), is(sameInstance(recipe)));
    }

    @Test
    void recipeFromCreateDto_givesEveryEntityItsOwnId()
    {
        Recipe recipe = Recipe.from(Generator.recipeCreateDto("cook"));

        assertThat(recipe.getSteps().get(0).getId(), is(not(recipe.getSteps().get(1).getId())));
        assertThat(recipe.getIngredients().get(0).getId(), is(not(recipe.getId())));
    }

    @Test
    void recipeDtoFrom_copiesFieldsAndChildren()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage("img");
        Generator.step(recipe, 1, "boil");
        Generator.ingredient(recipe, "Water", "1l").setOptional(true);

        RecipeDto dto = RecipeDto.from(recipe);

        assertThat(dto.getId(), is(recipe.getId()));
        assertThat(dto.getName(), is("Soup"));
        assertThat(dto.getCategory(), is("Soups"));
        assertThat(dto.getImage(), is("img"));
        assertThat(dto.getSteps(), hasSize(1));
        assertThat(dto.getSteps().get(0).getText(), is("boil"));
        assertThat(dto.getSteps().get(0).getNumber(), is(1));
        assertThat(dto.getIngredients().get(0).getName(), is("Water"));
        assertThat(dto.getIngredients().get(0).getQuantity(), is("1l"));
        assertThat(dto.getIngredients().get(0).isOptional(), is(true));
    }

    @Test
    void recipeDtoList_mapsEveryRecipe()
    {
        List<RecipeDto> dtos = RecipeDto.list(List.of(
                Generator.recipe("cook", "A", "X"),
                Generator.recipe("cook", "B", "Y")));

        assertThat(dtos.stream().map(RecipeDto::getName).toList(), contains("A", "B"));
        assertThat(RecipeDto.list(List.of()), is(empty()));
    }

    @Test
    void recipeListByCategoryDto_convertsEveryCategoryAndItem()
    {
        RecipeListItem soup = new RecipeListItem("1", "Tomato soup");
        soup.setCategory("Soups");
        soup.setHasImage(true);
        soup.setHasSteps(false);
        Map<String, List<RecipeListItem>> map = new LinkedHashMap<>();
        map.put("Soups", List.of(soup));
        map.put("Meat", List.of());

        RecipeListByCategoryDto dto = RecipeListByCategoryDto.from(map);

        assertThat(dto.getCategories(), hasSize(2));
        RecipeListByCategoryDto.CategoryDto soups = dto.getCategories().get(0);
        assertThat(soups.getName(), is("Soups"));
        assertThat(soups.getRecipes(), hasSize(1));
        assertThat(soups.getRecipes().get(0).getId(), is("1"));
        assertThat(soups.getRecipes().get(0).getName(), is("Tomato soup"));
        assertThat(soups.getRecipes().get(0).getHasImage(), is(true));
        assertThat(soups.getRecipes().get(0).getHasSteps(), is(false));
        assertThat(dto.getCategories().get(1).getRecipes(), is(empty()));
    }

    @Test
    void entitiesAreEqualById()
    {
        Recipe a = Generator.recipe("cook", "A", "X");
        Recipe b = Generator.recipe("cook", "B", "Y");
        b.setId(a.getId());

        assertThat(a, is(b));
        assertThat(a.hashCode(), is(b.hashCode()));
        assertThat(a.toString(), is("Recipe@" + a.getId()));
    }
}
