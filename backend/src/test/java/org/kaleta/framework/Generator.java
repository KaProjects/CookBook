package org.kaleta.framework;

import org.kaleta.dto.RecipeCreateDto;
import org.kaleta.dto.RecipeDto;
import org.kaleta.entity.Ingredient;
import org.kaleta.entity.Recipe;
import org.kaleta.entity.Step;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Base64;

/**
 * Sample data shared by the test classes.
 */
public final class Generator
{
    private Generator() {}

    public static RecipeCreateDto recipeCreateDto(String cook)
    {
        RecipeCreateDto dto = new RecipeCreateDto();
        dto.setCook(cook);
        dto.setName("Generated Recipe");
        dto.setCategory("Generated Category");
        dto.getSteps().add(stepDto(1, "first step", false));
        dto.getSteps().add(stepDto(2, "second step", true));
        dto.getIngredients().add(ingredientDto("Salt", "1 pinch", false));
        dto.getIngredients().add(ingredientDto("Pepper", "2 pinches", true));
        return dto;
    }

    public static RecipeDto.StepDto stepDto(int number, String text, boolean optional)
    {
        RecipeDto.StepDto dto = new RecipeDto.StepDto();
        dto.setNumber(number);
        dto.setText(text);
        dto.setOptional(optional);
        return dto;
    }

    public static RecipeDto.IngredientDto ingredientDto(String name, String quantity, boolean optional)
    {
        RecipeDto.IngredientDto dto = new RecipeDto.IngredientDto();
        dto.setName(name);
        dto.setQuantity(quantity);
        dto.setOptional(optional);
        return dto;
    }

    public static Recipe recipe(String cook, String name, String category)
    {
        Recipe recipe = new Recipe();
        recipe.setCook(cook);
        recipe.setName(name);
        recipe.setCategory(category);
        return recipe;
    }

    public static Step step(Recipe recipe, int number, String text)
    {
        Step step = new Step();
        step.setSRecipe(recipe);
        step.setNumber(number);
        step.setText(text);
        recipe.getSteps().add(step);
        return step;
    }

    public static Ingredient ingredient(Recipe recipe, String name, String quantity)
    {
        Ingredient ingredient = new Ingredient();
        ingredient.setIRecipe(recipe);
        ingredient.setName(name);
        ingredient.setQuantity(quantity);
        recipe.getIngredients().add(ingredient);
        return ingredient;
    }

    /**
     * A real image as the frontend sends it: a data URL, "prefix,base64".
     */
    public static String imageDataUrl(String format, int width, int height)
    {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, new Color((x * 7) % 256, (y * 13) % 256, ((x + y) * 3) % 256).getRGB());
            }
        }
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            ImageIO.write(image, format, output);
            return "data:image/" + format + ";base64," + Base64.getEncoder().encodeToString(output.toByteArray());
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static BufferedImage decodeDataUrl(String dataUrl)
    {
        try {
            byte[] bytes = Base64.getDecoder().decode(dataUrl.split(",")[1]);
            return ImageIO.read(new java.io.ByteArrayInputStream(bytes));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static boolean isJpeg(String dataUrl)
    {
        byte[] bytes = Base64.getDecoder().decode(dataUrl.split(",")[1]);
        return bytes.length > 3 && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF;
    }
}
