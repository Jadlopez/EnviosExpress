package com.enviosexpress.backend.ruta;

import com.enviosexpress.backend.conductor.Conductor;
import com.enviosexpress.backend.conductor.ConductorRepository;
import com.enviosexpress.backend.exception.ApiException;
import com.enviosexpress.backend.vehiculo.Vehiculo;
import com.enviosexpress.backend.vehiculo.VehiculoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RutaService {

    private final RutaRepository rutaRepository;
    private final VehiculoRepository vehiculoRepository;
    private final ConductorRepository conductorRepository;

    public RutaService(
            RutaRepository rutaRepository,
            VehiculoRepository vehiculoRepository,
            ConductorRepository conductorRepository
    ) {
        this.rutaRepository = rutaRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.conductorRepository = conductorRepository;
    }

    public List<RutaResponse> listarTodas() {
        return rutaRepository.findAll().stream()
                .map(RutaResponse::from)
                .toList();
    }

    public RutaResponse crear(RutaRequest request) {
        Ruta ruta = new Ruta();
        ruta.setOrigen(request.origen());
        ruta.setDestino(request.destino());
        ruta.setParadas(request.paradas());
        ruta.setOrigenLat(request.origenLat());
        ruta.setOrigenLng(request.origenLng());
        ruta.setDestinoLat(request.destinoLat());
        ruta.setDestinoLng(request.destinoLng());
        ruta.setCostoEstimado(request.costoEstimado());

        return RutaResponse.from(rutaRepository.save(ruta));
    }

    @Transactional
    public RutaResponse asignar(Long rutaId, AsignarRutaRequest request) {
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ruta no encontrada."));

        if (ruta.getEstado() != EstadoRuta.PENDIENTE) {
            throw new ApiException(HttpStatus.CONFLICT, "Solo se puede asignar una ruta en estado PENDIENTE.");
        }

        Vehiculo vehiculo = vehiculoRepository.findById(request.vehiculoId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Vehículo no encontrado."));
        if (!vehiculo.isDisponible()) {
            throw new ApiException(HttpStatus.CONFLICT, "El vehículo seleccionado no está disponible.");
        }

        Conductor conductor = conductorRepository.findById(request.conductorId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Conductor no encontrado."));
        if (!conductor.isDisponible()) {
            throw new ApiException(HttpStatus.CONFLICT, "El conductor seleccionado no está disponible.");
        }

        vehiculo.setDisponible(false);
        conductor.setDisponible(false);
        vehiculoRepository.save(vehiculo);
        conductorRepository.save(conductor);

        ruta.setVehiculo(vehiculo);
        ruta.setConductor(conductor);
        ruta.setEstado(EstadoRuta.ASIGNADA);

        return RutaResponse.from(rutaRepository.save(ruta));
    }

    @Transactional
    public RutaResponse finalizar(Long rutaId) {
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ruta no encontrada."));

        if (ruta.getEstado() != EstadoRuta.ASIGNADA) {
            throw new ApiException(HttpStatus.CONFLICT, "Solo se puede finalizar una ruta que esté ASIGNADA.");
        }

        liberarRecursos(ruta);
        ruta.setEstado(EstadoRuta.FINALIZADA);

        return RutaResponse.from(rutaRepository.save(ruta));
    }

    @Transactional
    public RutaResponse cancelar(Long rutaId) {
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ruta no encontrada."));

        if (ruta.getEstado() == EstadoRuta.FINALIZADA || ruta.getEstado() == EstadoRuta.CANCELADA) {
            throw new ApiException(HttpStatus.CONFLICT, "La ruta ya está en un estado final y no se puede cancelar.");
        }

        liberarRecursos(ruta);
        ruta.setEstado(EstadoRuta.CANCELADA);

        return RutaResponse.from(rutaRepository.save(ruta));
    }

    private void liberarRecursos(Ruta ruta) {
        if (ruta.getVehiculo() != null) {
            ruta.getVehiculo().setDisponible(true);
            vehiculoRepository.save(ruta.getVehiculo());
        }
        if (ruta.getConductor() != null) {
            ruta.getConductor().setDisponible(true);
            conductorRepository.save(ruta.getConductor());
        }
    }
}
