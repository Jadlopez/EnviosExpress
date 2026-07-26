package com.enviosexpress.backend.ruta;

import jakarta.validation.constraints.NotNull;

public record AsignarRutaRequest(
        @NotNull(message = "Debe indicar el vehiculo") Long vehiculoId,
        @NotNull(message = "Debe indicar el conductor") Long conductorId
) {
}
