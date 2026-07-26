package com.enviosexpress.backend.ruta;

import jakarta.validation.constraints.NotBlank;

public record RutaRequest(
        @NotBlank(message = "El origen es obligatorio") String origen,
        @NotBlank(message = "El destino es obligatorio") String destino,
        String paradas,
        Double origenLat,
        Double origenLng,
        Double destinoLat,
        Double destinoLng,
        Double costoEstimado
) {
}
