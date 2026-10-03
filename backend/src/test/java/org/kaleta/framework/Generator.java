package org.kaleta.framework;

import org.kaleta.persistence.entity.Ingredient;
import org.kaleta.persistence.entity.Recipe;
import org.kaleta.persistence.entity.Step;
import org.kaleta.rest.dto.IngredientDto;
import org.kaleta.rest.dto.RecipeCreateDto;
import org.kaleta.rest.dto.RecipeUpdateDto;
import org.kaleta.rest.dto.StepDto;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/** Sample data shared by the test classes. */
public final class Generator
{
    private Generator() {}

    public static RecipeCreateDto createDto(String cook)
    {
        RecipeCreateDto dto = new RecipeCreateDto();
        dto.setCook(cook);
        fill(dto);
        return dto;
    }

    public static RecipeUpdateDto updateDto()
    {
        RecipeUpdateDto dto = new RecipeUpdateDto();
        fill(dto);
        return dto;
    }

    private static void fill(RecipeUpdateDto dto)
    {
        dto.setName("Generated Recipe");
        dto.setCategory("Generated Category");
        dto.setSteps(new ArrayList<>(List.of(new StepDto(1, "first step", false), new StepDto(2, "second step", true))));
        dto.setIngredients(new ArrayList<>(List.of(new IngredientDto("Salt", "1 pinch", false), new IngredientDto("Pepper", "", true))));
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
        step.setNumber(number);
        step.setText(text);
        recipe.addStep(step);
        return step;
    }

    public static Ingredient ingredient(Recipe recipe, String name, String quantity)
    {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);
        ingredient.setQuantity(quantity);
        recipe.addIngredient(ingredient);
        return ingredient;
    }

    /** A real picture as the browser sends it: a data URL, "prefix,base64". */
    public static String image(String format, int width, int height)
    {
        boolean alpha = format.equals("png");
        BufferedImage image = new BufferedImage(width, height, alpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, new Color((x * 7) % 256, (y * 13) % 256, ((x + y) * 3) % 256, alpha ? (x * y) % 256 : 255).getRGB());
            }
        }
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            ImageIO.write(image, format, output);
            return "data:image/" + format + ";base64," + Base64.getEncoder().encodeToString(output.toByteArray());
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static BufferedImage decode(String dataUrl)
    {
        try {
            return ImageIO.read(new ByteArrayInputStream(Base64.getDecoder().decode(dataUrl.split(",")[1])));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static boolean isJpeg(String dataUrl)
    {
        byte[] bytes = Base64.getDecoder().decode(dataUrl.split(",")[1]);
        return dataUrl.startsWith("data:image/jpeg;base64,")
                && bytes.length > 3 && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF;
    }
}
