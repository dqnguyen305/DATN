package com.bookstore.backend.controller;

import com.bookstore.backend.entity.Author;
import com.bookstore.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public List<Author> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    @GetMapping("/{id}")
    public Author getAuthorById(@PathVariable Integer id) {
        return authorService.getAuthorById(id);
    }

    @PostMapping
    public Author createAuthor(@RequestBody Author author) {
        return authorService.createAuthor(author);
    }

    @PutMapping("/{id}")
    public Author updateAuthor(
            @PathVariable Integer id,
            @RequestBody Author author
    ) {
        return authorService.updateAuthor(id, author);
    }

    @DeleteMapping("/{id}")
    public String deleteAuthor(@PathVariable Integer id) {

        authorService.deleteAuthor(id);

        return "Delete author successfully";
    }
}