package com.enviosexpress.backend.conductor;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConductorRepository extends JpaRepository<Conductor, Long> {

    boolean existsByDocumento(String documento);
}
