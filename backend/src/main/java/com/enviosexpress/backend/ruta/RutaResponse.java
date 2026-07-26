package com.enviosexpress.backend.ruta;

import com.enviosexpress.backend.conductor.ConductorResponse;
import com.enviosexpress.backend.vehiculo.VehiculoResponse;

public record RutaResponse(
        Long id,
        String origen,
        String destino,
        String paradas,
        Double origenLat,
        Double origenLng,
        Double destinoLat,
        Double destinoLng,
        EstadoRuta estado,
        VehiculoResponse vehiculo,
        ConductorResponse conductor
) {

    public static RutaResponse from(Ruta ruta) {
        return new RutaResponse(
                ruta.getId(),
                ruta.getOrigen(),
                ruta.getDestino(),
                ruta.getParadas(),
                ruta.getOrigenLat(),
                ruta.getOrigenLng(),
                ruta.getDestinoLat(),
                ruta.getDestinoLng(),
                ruta.getEstado(),
                ruta.getVehiculo() != null ? VehiculoResponse.from(ruta.getVehiculo()) : null,
                ruta.getConductor() != null ? ConductorResponse.from(ruta.getConductor()) : null
        );
    }
}
