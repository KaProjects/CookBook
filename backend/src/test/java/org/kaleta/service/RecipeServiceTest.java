package org.kaleta.service;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import org.junit.jupiter.api.Test;
import org.kaleta.dao.RecipeDao;
import org.kaleta.entity.Recipe;
import org.kaleta.framework.Generator;
import org.mockito.ArgumentCaptor;

import java.awt.image.BufferedImage;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.sameInstance;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
class RecipeServiceTest
{
    @InjectMock
    RecipeDao recipeDao;

    @Inject
    RecipeService recipeService;

    @Test
    void getRecipe_returnsRecipeFromDao()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        when(recipeDao.get("42")).thenReturn(recipe);

        assertThat(recipeService.getRecipe("42"), is(sameInstance(recipe)));
    }

    @Test
    void getRecipe_returnsNullWhenMissing()
    {
        when(recipeDao.get("missing")).thenThrow(NoResultException.class);

        assertThat(recipeService.getRecipe("missing"), is(nullValue()));
    }

    @Test
    void getRecipes_delegatesToDao()
    {
        List<Recipe> recipes = List.of(Generator.recipe("cook", "Soup", "Soups"));
        when(recipeDao.getList()).thenReturn(recipes);

        assertThat(recipeService.getRecipes(), is(recipes));
    }

    @Test
    void createRecipe_withoutImage_persistsAsIsAndReturnsId()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        when(recipeDao.create(recipe)).thenReturn("new-id");

        assertThat(recipeService.createRecipe(recipe), is("new-id"));
        assertThat(recipe.getImage(), is(nullValue()));
    }

    @Test
    void createRecipe_compressesImageToJpegKeepingDataUrlPrefix()
    {
        String original = Generator.imageDataUrl("png", 64, 48);
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage(original);

        recipeService.createRecipe(recipe);

        ArgumentCaptor<Recipe> captor = ArgumentCaptor.forClass(Recipe.class);
        verify(recipeDao).create(captor.capture());
        String stored = captor.getValue().getImage();
        // The prefix is kept verbatim even though the payload is now JPEG.
        assertThat(stored, startsWith("data:image/png;base64,"));
        assertThat(Generator.isJpeg(stored), is(true));
        BufferedImage decoded = Generator.decodeDataUrl(stored);
        assertThat(decoded, is(notNullValue()));
        assertThat(decoded.getWidth(), is(64));
        assertThat(decoded.getHeight(), is(48));
    }

    @Test
    void createRecipe_compressionShrinksLargeImages()
    {
        String original = Generator.imageDataUrl("bmp", 400, 300);
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage(original);

        recipeService.createRecipe(recipe);

        assertThat(recipe.getImage().length(), is(lessThan(original.length())));
    }

    @Test
    void createRecipe_rejectsImageWithoutDataUrlPrefix()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage("not-a-data-url");

        assertThrows(ArrayIndexOutOfBoundsException.class, () -> recipeService.createRecipe(recipe));
        verify(recipeDao, never()).create(any());
    }

    @Test
    void createRecipe_rejectsPayloadThatIsNotAnImage()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage("data:image/png;base64,aGVsbG8=");

        assertThrows(IllegalArgumentException.class, () -> recipeService.createRecipe(recipe));
        verify(recipeDao, never()).create(any());
    }

    @Test
    void updateRecipe_compressesImageAndDelegates()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");
        recipe.setImage(Generator.imageDataUrl("png", 16, 16));

        recipeService.updateRecipe(recipe);

        verify(recipeDao).update(recipe);
        assertThat(Generator.isJpeg(recipe.getImage()), is(true));
    }

    @Test
    void updateRecipe_withoutImage_keepsNull()
    {
        Recipe recipe = Generator.recipe("cook", "Soup", "Soups");

        recipeService.updateRecipe(recipe);

        verify(recipeDao).update(recipe);
        assertThat(recipe.getImage(), is(nullValue()));
    }
}
