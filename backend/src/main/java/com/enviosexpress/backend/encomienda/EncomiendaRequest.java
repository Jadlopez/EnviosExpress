package com.enviosexpress.backend.encomienda;

import jakarta.validation.constraints.NotBlank;

public record EncomiendaRequest(
        @NotBlank(message = "El código de guía es obligatorio") String codigoGuia,
        @NotBlank(message = "El nombre del destinatario es obligatorio") String nombreDestinatario,
        @NotBlank(message = "La dirección de destino es obligatoria") String direccionDestino
) {
}
