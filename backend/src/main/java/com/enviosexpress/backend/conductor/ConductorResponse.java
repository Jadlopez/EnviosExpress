package com.enviosexpress.backend.conductor;

public record ConductorResponse(Long id, String nombre, String documento, String telefono, boolean disponible) {

    public static ConductorResponse from(Conductor conductor) {
        return new ConductorResponse(
                conductor.getId(),
                conductor.getNombre(),
                conductor.getDocumento(),
                conductor.getTelefono(),
                conductor.isDisponible()
        );
    }
}
