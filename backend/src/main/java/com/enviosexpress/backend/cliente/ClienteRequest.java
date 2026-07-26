package com.enviosexpress.backend.cliente;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "El teléfono es obligatorio") String telefono,
        @NotBlank(message = "La dirección es obligatoria") String direccion
) {
}
