package org.kaleta.cookbook.mvc;

import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    IngredientService ingredientService;

    @RequestMapping("/")
    public String home(Model model){
        model.addAttribute("categories", categoryService.listAllCategories());
        model.addAttribute("ingredients", ingredientService.listAllIngredients());
        return "home";
    }
}
