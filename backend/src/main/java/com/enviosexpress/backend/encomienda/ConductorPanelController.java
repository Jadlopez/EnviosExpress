package com.enviosexpress.backend.encomienda;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints usados por el panel del conductor (RF-10). El conductor autenticado
 * se resuelve por su correo (JWT), que debe coincidir con el correo registrado
 * en su ficha de Conductor para poder ver y actualizar sus propias encomiendas.
 */
@RestController
@RequestMapping("/api/v1/conductor")
@PreAuthorize("hasAnyRole('CONDUCTOR', 'ADMIN')")
public class ConductorPanelController {

    private final EncomiendaService encomiendaService;

    public ConductorPanelController(EncomiendaService encomiendaService) {
        this.encomiendaService = encomiendaService;
    }

    @GetMapping("/mis-rutas")
    public ResponseEntity<List<EncomiendaResponse>> misRutas(Authentication authentication) {
        return ResponseEntity.ok(encomiendaService.misEncomiendas(authentication.getName()));
    }

    @PutMapping("/encomienda/{id}/estado")
    public ResponseEntity<EncomiendaResponse> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarEstadoRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(encomiendaService.actualizarEstado(id, authentication.getName(), request.estado()));
    }
}
