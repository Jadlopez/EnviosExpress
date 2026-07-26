package com.enviosexpress.backend.vehiculo;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vehiculos")
@PreAuthorize("hasAnyRole('ADMIN', 'DESPACHADOR')")
public class VehiculoController {

    private final VehiculoService vehiculoService;

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @GetMapping
    public ResponseEntity<List<VehiculoResponse>> listar() {
        return ResponseEntity.ok(vehiculoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<VehiculoResponse> registrar(@Valid @RequestBody VehiculoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehiculoService.registrar(request));
    }
}
