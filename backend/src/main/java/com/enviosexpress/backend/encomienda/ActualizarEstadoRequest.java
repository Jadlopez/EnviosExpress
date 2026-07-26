package com.enviosexpress.backend.encomienda;

import jakarta.validation.constraints.NotNull;

public record ActualizarEstadoRequest(@NotNull(message = "Debe indicar el nuevo estado") EstadoEncomienda estado) {
}
