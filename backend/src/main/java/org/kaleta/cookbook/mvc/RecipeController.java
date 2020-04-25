package org.kaleta.cookbook.mvc;

import org.kaleta.cookbook.dto.CategoryDto;
import org.kaleta.cookbook.dto.CreateRecipeDto;
import org.kaleta.cookbook.dto.IngredientDto;
import org.kaleta.cookbook.facade.RecipeFacade;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.kaleta.cookbook.service.MappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/recipe")
public class RecipeController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    IngredientService ingredientService;

    @Autowired
    MappingService mappingService;

    @Autowired
    RecipeFacade recipeFacade;

    @ModelAttribute("categories")
    public List<CategoryDto> categories() {
        return mappingService.mapTo(categoryService.listAllCategories(), CategoryDto.class);
    }

    @ModelAttribute("ingredients")
    public List<IngredientDto> ingredients() {
        return mappingService.mapTo(ingredientService.listAllIngredients(), IngredientDto.class);
    }

    @RequestMapping("/list/all")
    public String listAll(Model model){

        model.addAttribute("allActive", "active");

        model.addAttribute("recipes", recipeFacade.listAllRecipes());
        return "recipe/list";
    }

    @RequestMapping("/list/category/{id}")
    public String listByCategory(@PathVariable String id, Model model){

        model.addAttribute("catShow", "show");
        model.addAttribute("catActive", id);

        model.addAttribute("recipes", recipeFacade.listRecipesByCategory(id));
        return "recipe/list";
    }

    @RequestMapping("/list/ingredient/{id}")
    public String listByIngredient(@PathVariable String id, Model model){

        model.addAttribute("ingShow", "show");
        model.addAttribute("ingActive", id);

        model.addAttribute("recipes", recipeFacade.listRecipesByIngredient(id));
        return "recipe/list";
    }

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newProduct(Model model) {

        model.addAttribute("recipeCreate", new CreateRecipeDto());

        return "recipe/new";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String create(@Valid @ModelAttribute("recipeCreate") CreateRecipeDto formBean, BindingResult bindingResult,
                         Model model, RedirectAttributes redirectAttributes, UriComponentsBuilder uriBuilder){
        if (bindingResult.hasErrors()) {
//            for (ObjectError ge : bindingResult.getGlobalErrors()) {
//                log.trace("ObjectError: {}", ge);
//            }
//            for (FieldError fe : bindingResult.getFieldErrors()) {
//                model.addAttribute(fe.getField() + "_error", true);
//                log.trace("FieldError: {}", fe);
//            }
            return "recipe/new";
        }

        System.out.println(formBean);

        String id = recipeFacade.createRecipe(formBean);

        redirectAttributes.addFlashAttribute("alert_success", "Recipe " + id + " was created");

        // TODO: 25.4.2020 later - show created recipe
        return "redirect:" + uriBuilder.path("/").encode().toUriString();
    }
}
