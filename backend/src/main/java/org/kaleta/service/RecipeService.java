package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.kaleta.persistence.api.RecipeDao;
import org.kaleta.persistence.entity.Ingredient;
import org.kaleta.persistence.entity.Recipe;
import org.kaleta.persistence.entity.RecipeSummary;
import org.kaleta.persistence.entity.Step;
import org.kaleta.rest.dto.IngredientDto;
import org.kaleta.rest.dto.MenuDto;
import org.kaleta.rest.dto.RecipeCreateDto;
import org.kaleta.rest.dto.RecipeDto;
import org.kaleta.rest.dto.RecipeListDto;
import org.kaleta.rest.dto.RecipeUpdateDto;
import org.kaleta.rest.dto.StepDto;
import org.kaleta.rest.error.ResourceNotFoundException;

import java.text.Collator;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@ApplicationScoped
public class RecipeService
{
    /** The recipes are written in Slovak, so they are sorted the way a Slovak reader expects. */
    private static final Collator COLLATOR = Collator.getInstance(Locale.forLanguageTag("sk"));

    @Inject
    RecipeDao recipeDao;

    @Inject
    ImageService imageService;

    @Inject
    UserService userService;

    public RecipeDto get(String id)
    {
        return toDto(find(id));
    }

    public RecipeDto create(RecipeCreateDto dto)
    {
        Recipe recipe = new Recipe();
        recipe.setCook(dto.getCook());
        apply(recipe, dto, dto.getImage() == null ? null : imageService.toJpeg(dto.getImage()));
        recipeDao.create(recipe);
        return toDto(recipe);
    }

    /**
     * Replaces everything editable about the recipe. The image is only re-encoded when it is a new
     * one: the editor sends back the stored image unchanged, and compressing that again on every
     * save made it a little worse each time.
     */
    @Transactional
    public RecipeDto update(String id, RecipeUpdateDto dto)
    {
        Recipe recipe = find(id);
        String image = dto.getImage() == null || dto.getImage().equals(recipe.getImage())
                ? dto.getImage()
                : imageService.toJpeg(dto.getImage());
        recipe.getSteps().clear();
        recipe.getIngredients().clear();
        apply(recipe, dto, image);
        return toDto(recipeDao.save(recipe));
    }

    public MenuDto getMenu(String cook)
    {
        userService.requireUser(cook);
        return new MenuDto(sorted(recipeDao.listCategories(cook)), sorted(recipeDao.listIngredients(cook)));
    }

    public RecipeListDto list(String cook, String category, String ingredient)
    {
        userService.requireUser(cook);
        Map<String, List<RecipeSummary>> byCategory = recipeDao.listSummaries(cook, category, ingredient).stream()
                .collect(Collectors.groupingBy(RecipeSummary::category, () -> new TreeMap<>(COLLATOR), Collectors.toList()));

        return new RecipeListDto(byCategory.entrySet().stream()
                .map(entry -> new RecipeListDto.Category(entry.getKey(), entry.getValue().stream()
                        .sorted(Comparator.comparing(RecipeSummary::name, COLLATOR))
                        .map(summary -> new RecipeListDto.Item(summary.id(), summary.name(), summary.hasImage(), summary.hasSteps()))
                        .toList()))
                .toList());
    }

    private Recipe find(String id)
    {
        return recipeDao.find(id).orElseThrow(() -> new ResourceNotFoundException("Recipe '" + id + "' does not exist."));
    }

    /**
     * The steps are numbered 1, 2, 3... in the order of the numbers they came with, so a gap or a
     * duplicate left by the editor cannot end up in the database.
     */
    private static void apply(Recipe recipe, RecipeUpdateDto dto, String image)
    {
        recipe.setName(dto.getName().trim());
        recipe.setCategory(dto.getCategory().trim());
        recipe.setImage(image);

        List<StepDto> steps = dto.getSteps().stream().sorted(Comparator.comparing(StepDto::getNumber)).toList();
        for (int index = 0; index < steps.size(); index++) {
            Step step = new Step();
            step.setNumber(index + 1);
            step.setText(steps.get(index).getText().trim());
            step.setOptional(steps.get(index).isOptional());
            recipe.addStep(step);
        }
        for (IngredientDto ingredientDto : dto.getIngredients()) {
            Ingredient ingredient = new Ingredient();
            ingredient.setName(ingredientDto.getName().trim());
            ingredient.setQuantity(ingredientDto.getQuantity().trim());
            ingredient.setOptional(ingredientDto.isOptional());
            recipe.addIngredient(ingredient);
        }
    }

    private static List<String> sorted(List<String> values)
    {
        return values.stream().sorted(COLLATOR).toList();
    }

    private static RecipeDto toDto(Recipe recipe)
    {
        RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getId());
        dto.setCook(recipe.getCook());
        dto.setName(recipe.getName());
        dto.setCategory(recipe.getCategory());
        dto.setImage(recipe.getImage());
        dto.setSteps(recipe.getSteps().stream()
                .sorted(Comparator.comparing(Step::getNumber))
                .map(step -> new StepDto(step.getNumber(), step.getText(), step.isOptional()))
                .toList());
        dto.setIngredients(recipe.getIngredients().stream()
                .map(ingredient -> new IngredientDto(ingredient.getName(), ingredient.getQuantity(), ingredient.isOptional()))
                .toList());
        return dto;
    }
}
