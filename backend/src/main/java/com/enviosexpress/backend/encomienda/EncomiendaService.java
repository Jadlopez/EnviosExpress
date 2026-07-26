package com.enviosexpress.backend.encomienda;

import com.enviosexpress.backend.exception.ApiException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EncomiendaService {

    private final EncomiendaRepository encomiendaRepository;

    public EncomiendaService(EncomiendaRepository encomiendaRepository) {
        this.encomiendaRepository = encomiendaRepository;
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
}
