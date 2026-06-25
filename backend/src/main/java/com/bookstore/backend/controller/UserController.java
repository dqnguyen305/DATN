package com.bookstore.backend.controller;

import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Integer id
    ) {
        return userService.getUserById(id);
    }
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Integer id,
            @RequestBody User user
    ) {
        return userService.updateUser(id, user);
    }
    @PutMapping("/{id}/toggle-status")
    public User toggleStatus(
            @PathVariable Integer id
    ) {
        return userService.toggleStatus(id);
    }
}