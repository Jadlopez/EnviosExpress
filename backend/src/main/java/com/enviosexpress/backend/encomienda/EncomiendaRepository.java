package com.enviosexpress.backend.encomienda;

import com.enviosexpress.backend.conductor.Conductor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncomiendaRepository extends JpaRepository<Encomienda, Long> {

    boolean existsByCodigoGuia(String codigoGuia);

    Optional<Encomienda> findByCodigoGuia(String codigoGuia);

    List<Encomienda> findByConductor(Conductor conductor);
}
