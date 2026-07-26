package com.enviosexpress.backend.reporte;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reportes")
@PreAuthorize("hasAnyRole('ADMIN', 'DESPACHADOR')")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping
    public ResponseEntity<List<ReporteRutaResponse>> generarReporte(
            @RequestParam String desde,
            @RequestParam String hasta
    ) {
        return ResponseEntity.ok(reporteService.generarReporteRutas(desde, hasta));
    }
}
