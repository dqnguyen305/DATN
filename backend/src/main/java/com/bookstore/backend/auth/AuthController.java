package com.bookstore.backend.auth;

import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.bookstore.backend.jwt.JwtService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        Optional<User> optionalUser =
                userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return Map.of("message", "User not found");
        }

        User user = optionalUser.get();

        if (user.getStatus().equals("BLOCKED")) {

            return Map.of(
                    "message",
                    "Account has been blocked"
            );
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Map.of("message", "Wrong password");
        }

        String token = jwtService.generateToken(user);

        return Map.of(
                "token", token,
                "message", "Login success"
        );
    }
}