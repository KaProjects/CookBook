package org.kaleta.cookbook;

import org.kaleta.cookbook.dao.CategoryDao;
import org.kaleta.cookbook.dao.IngredientDao;
import org.kaleta.cookbook.dao.RecipeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class Initializer extends SpringBootServletInitializer {
//public class Initializer implements CommandLineRunner {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Initializer.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Initializer.class, args);
    }

//    @Autowired private CategoryDao categoryDao;
//    @Autowired private IngredientDao ingredientDao;
//    @Autowired private RecipeDao recipeDao;
//
//    @Override
//    @Transactional
//    public void run(String... args) throws Exception {
//        //prepareProductionLikeData();
//    }
//
//    private void prepareProductionLikeData(){
//        Category categoryA = new Category();
//        categoryA.setName("Category A");
//        categoryDao.save(categoryA);
//
//        Category categoryB = new Category();
//        categoryB.setName("Category B");
//        categoryDao.save(categoryB);
//
//        Ingredient ingredientA = new Ingredient();
//        ingredientA.setName("Ingredient A");
//        ingredientDao.save(ingredientA);
//
//        Ingredient ingredientB = new Ingredient();
//        ingredientB.setName("Ingredient B");
//        ingredientDao.save(ingredientB);
//
//        Recipe recipeA = new Recipe();
//        recipeA.setName("Recipe A");
//        recipeA.setCategory(categoryA);
//
//        Step stepA1 = new Step();
//        stepA1.setNumber(1);
//        stepA1.setText("asdasd dasd ");
//        recipeA.addStep(stepA1);
//
//        Step stepA2 = new Step();
//        stepA2.setNumber(2);
//        stepA2.setText("asssdaga adas asd ");
//        recipeA.addStep(stepA2);
//
//        RecipeIngredient recipeIngredient = new RecipeIngredient();
//        recipeIngredient.setIngredient(ingredientA);
//        recipeIngredient.setQuantity(200);
//        recipeIngredient.setUnit("mg");
//        recipeA.addRecipeIngredient(recipeIngredient);
//
//        recipeDao.save(recipeA);
//
//        Recipe recipeB = new Recipe();
//        recipeB.setName("Recipe B");
//        recipeB.setCategory(categoryA);
//        recipeDao.save(recipeB);
//
//    }
}
