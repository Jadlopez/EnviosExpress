package com.enviosexpress.backend.ruta;

import com.enviosexpress.backend.conductor.Conductor;
import com.enviosexpress.backend.vehiculo.Vehiculo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rutas")
@Getter
@Setter
@NoArgsConstructor
public class Ruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origen;

    @Column(nullable = false)
    private String destino;

    private String paradas;

    @Column(name = "origen_lat")
    private Double origenLat;

    @Column(name = "origen_lng")
    private Double origenLng;

    @Column(name = "destino_lat")
    private Double destinoLat;

    @Column(name = "destino_lng")
    private Double destinoLng;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoRuta estado = EstadoRuta.PENDIENTE;

    @Column(name = "costo_estimado")
    private Double costoEstimado;

    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion = Instant.now();

    @ManyToOne
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo;

    @ManyToOne
    @JoinColumn(name = "conductor_id")
    private Conductor conductor;
}
