package com.bookstore.backend.service;

import com.bookstore.backend.entity.Author;
import com.bookstore.backend.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Author getAuthorById(Integer id) {

        return authorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Author not found"));
    }

    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    public Author updateAuthor(
            Integer id,
            Author updatedAuthor
    ) {

        Author author = getAuthorById(id);

        author.setName(updatedAuthor.getName());
        author.setBio(updatedAuthor.getBio());

        return authorRepository.save(author);
    }

    public void deleteAuthor(Integer id) {

        Author author = getAuthorById(id);

        authorRepository.delete(author);
    }
}