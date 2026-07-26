package com.enviosexpress.backend.ruta;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RutaRepository extends JpaRepository<Ruta, Long> {

    List<Ruta> findByFechaCreacionBetween(Instant desde, Instant hasta);
}
