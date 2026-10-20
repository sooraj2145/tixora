package com.tixora.backend.controller;

import com.tixora.backend.entity.User;
import com.tixora.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.web.csrf.CsrfToken;
import java.util.Map;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import com.tixora.backend.dto.AuthResponse;
import com.tixora.backend.dto.LoginRequest;
import com.tixora.backend.dto.LoginResponse;
import com.tixora.backend.dto.RegisterRequest;
import com.tixora.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    public AuthController(
            AuthService authService,
            UserRepository userRepository
            ) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        return Map.of(
                "token", csrfToken.getToken(),
                "headerName", csrfToken.getHeaderName()
        );
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Not authenticated"
                    );
        }

        User user = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "User not found"
        ));

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()

        );
    }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request
            ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from(
                "TIXORA_AUTH",
                loginResponse.accessToken()
            )
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/")
                .maxAge(15 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new LoginResponse(
                null,
                loginResponse.tokenType(),
                loginResponse.id(),
                loginResponse.name(),
                loginResponse.email(),
                loginResponse.role()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletResponse response
    ) {
        ResponseCookie cookie = ResponseCookie.from("TIXORA_AUTH", "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.noContent().build();
    }
}
