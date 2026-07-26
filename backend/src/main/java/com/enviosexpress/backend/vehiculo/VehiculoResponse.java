package com.enviosexpress.backend.vehiculo;

public record VehiculoResponse(Long id, String placa, String modelo, Double capacidadKg, boolean disponible) {

    public static VehiculoResponse from(Vehiculo vehiculo) {
        return new VehiculoResponse(
                vehiculo.getId(),
                vehiculo.getPlaca(),
                vehiculo.getModelo(),
                vehiculo.getCapacidadKg(),
                vehiculo.isDisponible()
        );
    }
}
