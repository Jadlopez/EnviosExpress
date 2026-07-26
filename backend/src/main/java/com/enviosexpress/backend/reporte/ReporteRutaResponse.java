package com.enviosexpress.backend.reporte;

import com.enviosexpress.backend.ruta.Ruta;
import java.time.Instant;

/**
 * Fila plana (sin objetos anidados) para que la tabla generica del frontend
 * (que arma columnas a partir de Object.keys) se vea legible.
 */
public record ReporteRutaResponse(
        Long rutaId,
        String origen,
        String destino,
        String estado,
        String vehiculoPlaca,
        String conductorNombre,
        Double costoEstimado,
        Instant fechaCreacion
) {

    public static ReporteRutaResponse from(Ruta ruta) {
        return new ReporteRutaResponse(
                ruta.getId(),
                ruta.getOrigen(),
                ruta.getDestino(),
                ruta.getEstado().name(),
                ruta.getVehiculo() != null ? ruta.getVehiculo().getPlaca() : "Sin asignar",
                ruta.getConductor() != null ? ruta.getConductor().getNombre() : "Sin asignar",
                ruta.getCostoEstimado(),
                ruta.getFechaCreacion()
        );
    }
}
