package org.kaleta.cookbook.service;

import org.kaleta.cookbook.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> listAllCategories();

    Category findCategory(String id);

    String createCategory(String name);

}
