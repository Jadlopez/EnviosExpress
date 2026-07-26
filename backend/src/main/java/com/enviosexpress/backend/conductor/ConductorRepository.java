package com.enviosexpress.backend.conductor;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConductorRepository extends JpaRepository<Conductor, Long> {

    boolean existsByDocumento(String documento);

    boolean existsByEmail(String email);

    Optional<Conductor> findByEmail(String email);
}
