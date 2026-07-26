package com.enviosexpress.backend.conductor;

import com.enviosexpress.backend.exception.ApiException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ConductorService {

    private final ConductorRepository conductorRepository;

    public ConductorService(ConductorRepository conductorRepository) {
        this.conductorRepository = conductorRepository;
    }

    public List<ConductorResponse> listarTodos() {
        return conductorRepository.findAll().stream()
                .map(ConductorResponse::from)
                .toList();
    }

    public ConductorResponse registrar(ConductorRequest request) {
        if (conductorRepository.existsByDocumento(request.documento())) {
            throw new ApiException(HttpStatus.CONFLICT, "El documento ya está registrado.");
        }
        if (conductorRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Ese correo ya está vinculado a otro conductor.");
        }

        Conductor conductor = new Conductor();
        conductor.setNombre(request.nombre());
        conductor.setDocumento(request.documento());
        conductor.setTelefono(request.telefono());
        conductor.setEmail(request.email());

        return ConductorResponse.from(conductorRepository.save(conductor));
    }
}
