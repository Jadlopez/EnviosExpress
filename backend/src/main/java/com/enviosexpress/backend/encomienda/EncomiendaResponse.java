package com.enviosexpress.backend.encomienda;

public record EncomiendaResponse(
        Long id,
        String codigoGuia,
        String nombreDestinatario,
        String direccionDestino,
        EstadoEncomienda estado
) {

    public static EncomiendaResponse from(Encomienda encomienda) {
        return new EncomiendaResponse(
                encomienda.getId(),
                encomienda.getCodigoGuia(),
                encomienda.getNombreDestinatario(),
                encomienda.getDireccionDestino(),
                encomienda.getEstado()
        );
    }
}
