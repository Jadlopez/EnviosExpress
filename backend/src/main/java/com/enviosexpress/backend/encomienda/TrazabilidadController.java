package com.enviosexpress.backend.encomienda;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint publico de rastreo (RF-09): no requiere autenticacion,
 * consistente con el portal de rastreo publico del frontend.
 */
@RestController
@RequestMapping("/api/v1/trazabilidad")
public class TrazabilidadController {

    private final EncomiendaService encomiendaService;

    public TrazabilidadController(EncomiendaService encomiendaService) {
        this.encomiendaService = encomiendaService;
    }

    @GetMapping("/{codigoGuia}")
    public ResponseEntity<EncomiendaResponse> consultar(@PathVariable String codigoGuia) {
        return ResponseEntity.ok(encomiendaService.consultarPorCodigoGuia(codigoGuia));
    }
}
