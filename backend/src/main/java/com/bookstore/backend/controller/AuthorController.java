package com.bookstore.backend.controller;

import com.bookstore.backend.entity.Author;
import com.bookstore.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    // GET: /api/authors?page=0&size=8
    @GetMapping
    public Page<Author> getAllAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {

        return authorService.getAllAuthors(page, size);
    }

    // GET: /api/authors/1
    @GetMapping("/{id}")
    public Author getAuthorById(
            @PathVariable Integer id
    ) {

        return authorService.getAuthorById(id);
    }

    // POST: /api/authors
    @PostMapping
    public Author createAuthor(
            @RequestBody Author author
    ) {

        return authorService.createAuthor(author);
    }

    // PUT: /api/authors/1
    @PutMapping("/{id}")
    public Author updateAuthor(
            @PathVariable Integer id,
            @RequestBody Author author
    ) {

        return authorService.updateAuthor(id, author);
    }

    // DELETE: /api/authors/1
    @DeleteMapping("/{id}")
    public String deleteAuthor(
            @PathVariable Integer id
    ) {

        authorService.deleteAuthor(id);

        return "Xóa tác giả thành công";
    }
}