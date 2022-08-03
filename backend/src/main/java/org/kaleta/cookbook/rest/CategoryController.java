package org.kaleta.cookbook.rest;

import org.kaleta.cookbook.dto.CategoryDto;
import org.kaleta.cookbook.service.CategoryService;
import org.kaleta.cookbook.service.MappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/category")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    MappingService mappingService;

    @RequestMapping(value = "/{id}")
    public CategoryDto getCategory(@PathVariable("id") String id) {
        return mappingService.mapTo(categoryService.findCategory(id), CategoryDto.class);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public String addCategory(@Valid @RequestBody CategoryDto categoryDto) {
        return categoryService.createCategory(categoryDto.getName());
    }

    @RequestMapping(value = "/{id}/delete", method = RequestMethod.GET)
    public void deleteCategory(@PathVariable("id") String id) {
        categoryService.deleteCategory(id);
    }
}
