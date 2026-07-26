package com.enviosexpress.backend.reporte;

import com.enviosexpress.backend.exception.ApiException;
import com.enviosexpress.backend.ruta.RutaRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ReporteService {

    private final RutaRepository rutaRepository;

    public ReporteService(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    public List<ReporteRutaResponse> generarReporteRutas(String desde, String hasta) {
        LocalDate fechaDesde;
        LocalDate fechaHasta;
        try {
            fechaDesde = LocalDate.parse(desde);
            fechaHasta = LocalDate.parse(hasta);
        } catch (DateTimeParseException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Las fechas deben tener formato AAAA-MM-DD.");
        }

        if (fechaHasta.isBefore(fechaDesde)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La fecha 'hasta' no puede ser anterior a 'desde'.");
        }

        ZoneId zona = ZoneId.systemDefault();
        var inicio = fechaDesde.atStartOfDay(zona).toInstant();
        var fin = fechaHasta.plusDays(1).atStartOfDay(zona).toInstant();

        return rutaRepository.findByFechaCreacionBetween(inicio, fin).stream()
                .map(ReporteRutaResponse::from)
                .toList();
    }
}
