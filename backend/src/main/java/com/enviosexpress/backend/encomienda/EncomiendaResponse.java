package com.enviosexpress.backend.encomienda;

import com.enviosexpress.backend.conductor.ConductorResponse;

public record EncomiendaResponse(
        Long id,
        String codigoGuia,
        String nombreDestinatario,
        String direccionDestino,
        EstadoEncomienda estado,
        ConductorResponse conductor
) {

    public static EncomiendaResponse from(Encomienda encomienda) {
        return new EncomiendaResponse(
                encomienda.getId(),
                encomienda.getCodigoGuia(),
                encomienda.getNombreDestinatario(),
                encomienda.getDireccionDestino(),
                encomienda.getEstado(),
                encomienda.getConductor() != null ? ConductorResponse.from(encomienda.getConductor()) : null
        );
    }
}
