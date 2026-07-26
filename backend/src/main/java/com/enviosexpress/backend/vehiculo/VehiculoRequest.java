package com.enviosexpress.backend.vehiculo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record VehiculoRequest(
        @NotBlank(message = "La placa es obligatoria") String placa,
        @NotBlank(message = "El modelo es obligatorio") String modelo,
        @Positive(message = "La capacidad debe ser mayor a cero") Double capacidadKg
) {
}
