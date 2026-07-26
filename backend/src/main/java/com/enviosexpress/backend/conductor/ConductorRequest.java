package com.enviosexpress.backend.conductor;

import jakarta.validation.constraints.NotBlank;

public record ConductorRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "El documento es obligatorio") String documento,
        @NotBlank(message = "El teléfono es obligatorio") String telefono
) {
}
