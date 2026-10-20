package com.tixora.backend.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        Long id,
        String name,
        String email,
        String role
) {
}
