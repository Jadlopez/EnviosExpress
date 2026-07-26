package com.enviosexpress.backend.ruta;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rutas")
@PreAuthorize("hasAnyRole('ADMIN', 'DESPACHADOR')")
public class RutaController {

    private final RutaService rutaService;

    public RutaController(RutaService rutaService) {
        this.rutaService = rutaService;
    }

    @GetMapping
    public ResponseEntity<List<RutaResponse>> listar() {
        return ResponseEntity.ok(rutaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<RutaResponse> crear(@Valid @RequestBody RutaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rutaService.crear(request));
    }

    @PutMapping("/{id}/asignar")
    public ResponseEntity<RutaResponse> asignar(
            @PathVariable Long id,
            @Valid @RequestBody AsignarRutaRequest request
    ) {
        return ResponseEntity.ok(rutaService.asignar(id, request));
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<RutaResponse> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(rutaService.finalizar(id));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<RutaResponse> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(rutaService.cancelar(id));
    }
}
