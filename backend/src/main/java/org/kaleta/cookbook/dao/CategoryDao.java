package org.kaleta.cookbook.dao;

import org.kaleta.cookbook.entity.Category;
import org.kaleta.cookbook.repository.CategoryRepository;
import org.springframework.data.repository.CrudRepository;

/**
 * Only to group CrudRepo and CategoryRepo.
 */
public interface CategoryDao extends CrudRepository<Category, String>, CategoryRepository {

}
