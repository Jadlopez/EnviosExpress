package com.enviosexpress.backend.vehiculo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {

    boolean existsByPlaca(String placa);
}
