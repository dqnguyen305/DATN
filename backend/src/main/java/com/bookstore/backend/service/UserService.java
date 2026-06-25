package com.bookstore.backend.service;

import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }
    public User getUserById(
            Integer id
    ) {

        return userRepository
                .findById(id)
                .orElseThrow();
    }
    public User updateUser(
            Integer id,
            User updatedUser
    ) {

        User user = userRepository
                .findById(id)
                .orElseThrow();

        user.setEmail(
                updatedUser.getEmail()
        );

        user.setPhone(
                updatedUser.getPhone()
        );

        user.setRole(
                updatedUser.getRole()
        );

        return userRepository.save(user);
    }
    public User toggleStatus(
            Integer id
    ) {

        User user = userRepository
                .findById(id)
                .orElseThrow();

        if (user.getStatus().equals("ACTIVE")) {

            user.setStatus("BLOCKED");

        } else {

            user.setStatus("ACTIVE");
        }

        return userRepository.save(user);
    }
}