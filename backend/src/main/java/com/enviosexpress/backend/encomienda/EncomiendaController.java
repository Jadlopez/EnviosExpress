package com.enviosexpress.backend.encomienda;

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
@RequestMapping("/api/v1/encomiendas")
@PreAuthorize("hasAnyRole('ADMIN', 'DESPACHADOR')")
public class EncomiendaController {

    private final EncomiendaService encomiendaService;

    public EncomiendaController(EncomiendaService encomiendaService) {
        this.encomiendaService = encomiendaService;
    }

    @GetMapping
    public ResponseEntity<List<EncomiendaResponse>> listar() {
        return ResponseEntity.ok(encomiendaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<EncomiendaResponse> registrar(@Valid @RequestBody EncomiendaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(encomiendaService.registrar(request));
    }
}
