package org.kaleta.cookbook.service;

import org.kaleta.cookbook.dao.CategoryDao;
import org.kaleta.cookbook.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryDao categoryDao;

    @Override
    public List<Category> listAllCategories() {
        return (List<Category>) categoryDao.findAll();
    }

    @Override
    public Category findCategory(String id) {
        return categoryDao.findById(id).get();
    }

    @Override
    public String createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryDao.save(category).getId();
    }
}
