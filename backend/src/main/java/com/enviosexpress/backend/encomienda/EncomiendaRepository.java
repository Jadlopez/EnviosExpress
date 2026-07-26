package com.enviosexpress.backend.encomienda;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncomiendaRepository extends JpaRepository<Encomienda, Long> {

    boolean existsByCodigoGuia(String codigoGuia);

    Optional<Encomienda> findByCodigoGuia(String codigoGuia);
}
