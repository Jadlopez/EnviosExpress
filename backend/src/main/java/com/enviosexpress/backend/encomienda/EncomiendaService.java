package com.enviosexpress.backend.encomienda;

import com.enviosexpress.backend.conductor.Conductor;
import com.enviosexpress.backend.conductor.ConductorRepository;
import com.enviosexpress.backend.exception.ApiException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EncomiendaService {

    private final EncomiendaRepository encomiendaRepository;
    private final ConductorRepository conductorRepository;

    public EncomiendaService(EncomiendaRepository encomiendaRepository, ConductorRepository conductorRepository) {
        this.encomiendaRepository = encomiendaRepository;
        this.conductorRepository = conductorRepository;
    }

    public List<EncomiendaResponse> listarTodas() {
        return encomiendaRepository.findAll().stream()
                .map(EncomiendaResponse::from)
                .toList();
    }

    public EncomiendaResponse registrar(EncomiendaRequest request) {
        if (encomiendaRepository.existsByCodigoGuia(request.codigoGuia())) {
            throw new ApiException(HttpStatus.CONFLICT, "El código de guía ya está registrado.");
        }

        Encomienda encomienda = new Encomienda();
        encomienda.setCodigoGuia(request.codigoGuia());
        encomienda.setNombreDestinatario(request.nombreDestinatario());
        encomienda.setDireccionDestino(request.direccionDestino());

        return EncomiendaResponse.from(encomiendaRepository.save(encomienda));
    }

    public EncomiendaResponse consultarPorCodigoGuia(String codigoGuia) {
        Encomienda encomienda = encomiendaRepository.findByCodigoGuia(codigoGuia)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No se encontró ninguna encomienda con ese código de guía."));

        return EncomiendaResponse.from(encomienda);
    }

    public EncomiendaResponse asignarConductor(Long encomiendaId, Long conductorId) {
        Encomienda encomienda = encomiendaRepository.findById(encomiendaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Encomienda no encontrada."));

        Conductor conductor = conductorRepository.findById(conductorId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Conductor no encontrado."));

        encomienda.setConductor(conductor);
        return EncomiendaResponse.from(encomiendaRepository.save(encomienda));
    }

    public List<EncomiendaResponse> misEncomiendas(String emailConductor) {
        Conductor conductor = conductorRepository.findByEmail(emailConductor)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No existe una ficha de conductor asociada a tu cuenta."));

        return encomiendaRepository.findByConductor(conductor).stream()
                .map(EncomiendaResponse::from)
                .toList();
    }

    public EncomiendaResponse actualizarEstado(Long encomiendaId, String emailConductor, EstadoEncomienda nuevoEstado) {
        Conductor conductor = conductorRepository.findByEmail(emailConductor)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No existe una ficha de conductor asociada a tu cuenta."));

        Encomienda encomienda = encomiendaRepository.findById(encomiendaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Encomienda no encontrada."));

        if (encomienda.getConductor() == null || !encomienda.getConductor().getId().equals(conductor.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "No tienes permiso para modificar esta encomienda.");
        }

        encomienda.setEstado(nuevoEstado);
        return EncomiendaResponse.from(encomiendaRepository.save(encomienda));
    }
}
