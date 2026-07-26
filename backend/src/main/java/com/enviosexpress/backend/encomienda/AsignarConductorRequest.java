package com.enviosexpress.backend.encomienda;

import jakarta.validation.constraints.NotNull;

public record AsignarConductorRequest(@NotNull(message = "Debe indicar el conductor") Long conductorId) {
}
