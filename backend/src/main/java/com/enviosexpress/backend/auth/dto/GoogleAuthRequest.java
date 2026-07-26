package com.enviosexpress.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(@NotBlank(message = "El idToken es obligatorio") String idToken) {
}
