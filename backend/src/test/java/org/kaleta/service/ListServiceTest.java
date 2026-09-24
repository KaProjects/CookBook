package org.kaleta.service;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.kaleta.dao.ListDao;
import org.kaleta.entity.RecipeListItem;

import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.aMapWithSize;
import static org.hamcrest.Matchers.anEmptyMap;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
class ListServiceTest
{
    @InjectMock
    ListDao listDao;

    @Inject
    ListService listService;

    @Test
    void listCategories_delegatesToDao()
    {
        when(listDao.categories("cook")).thenReturn(List.of("Soups", "Meat"));

        assertThat(listService.listCategories("cook"), contains("Soups", "Meat"));
    }

    @Test
    void listIngredients_delegatesToDao()
    {
        when(listDao.ingredients("cook")).thenReturn(List.of("Salt"));

        assertThat(listService.listIngredients("cook"), contains("Salt"));
    }

    @Test
    void listRecipesByCategory_groupsByCategoryKeepingDaoOrder()
    {
        RecipeListItem soup1 = item("1", "Tomato soup", "Soups");
        RecipeListItem steak = item("2", "Steak", "Meat");
        RecipeListItem soup2 = item("3", "Onion soup", "Soups");
        when(listDao.recipes("cook", null, null)).thenReturn(List.of(soup1, steak, soup2));

        Map<String, List<RecipeListItem>> result = listService.listRecipesByCategory("cook", null, null);

        assertThat(result, is(aMapWithSize(2)));
        assertThat(result.get("Soups"), contains(soup1, soup2));
        assertThat(result.get("Meat"), contains(steak));
    }

    @Test
    void listRecipesByCategory_passesFiltersThrough()
    {
        when(listDao.recipes("cook", "Soups", "Salt")).thenReturn(List.of());

        assertThat(listService.listRecipesByCategory("cook", "Soups", "Salt"), is(anEmptyMap()));
        verify(listDao).recipes("cook", "Soups", "Salt");
    }

    private static RecipeListItem item(String id, String name, String category)
    {
        RecipeListItem item = new RecipeListItem(id, name);
        item.setCategory(category);
        item.setHasImage(false);
        item.setHasSteps(true);
        return item;
    }
}
