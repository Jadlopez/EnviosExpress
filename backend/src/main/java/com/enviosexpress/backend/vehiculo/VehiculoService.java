package com.enviosexpress.backend.vehiculo;

import com.enviosexpress.backend.exception.ApiException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<VehiculoResponse> listarTodos() {
        return vehiculoRepository.findAll().stream()
                .map(VehiculoResponse::from)
                .toList();
    }

    public VehiculoResponse registrar(VehiculoRequest request) {
        if (vehiculoRepository.existsByPlaca(request.placa())) {
            throw new ApiException(HttpStatus.CONFLICT, "La placa ya está registrada.");
        }

        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setPlaca(request.placa());
        vehiculo.setModelo(request.modelo());
        vehiculo.setCapacidadKg(request.capacidadKg());

        return VehiculoResponse.from(vehiculoRepository.save(vehiculo));
    }
}
