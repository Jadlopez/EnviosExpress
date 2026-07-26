package com.enviosexpress.backend.usuario;

import jakarta.validation.constraints.NotNull;

public record ActualizarRolRequest(@NotNull Rol rol) {
}
