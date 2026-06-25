package com.bookstore.backend.controller;

import com.bookstore.backend.entity.Category;
import com.bookstore.backend.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    @GetMapping("/api/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/api/categories/{id}")
    public Category getCategoryById(
            @PathVariable Integer id
    ) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping("/api/admin/categories")
    public Category createCategory(
            @RequestBody Category category
    ) {
        return categoryService.createCategory(category);
    }

    @PutMapping("/api/admin/categories/{id}")
    public Category updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category
    ) {
        return categoryService.updateCategory(
                id,
                category
        );
    }

    @DeleteMapping("/api/admin/categories/{id}")
    public void deleteCategory(
            @PathVariable Integer id
    ) {
        categoryService.deleteCategory(id);
    }
}