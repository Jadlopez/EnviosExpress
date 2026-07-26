package com.enviosexpress.backend.encomienda;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "encomiendas")
@Getter
@Setter
@NoArgsConstructor
public class Encomienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_guia", nullable = false, unique = true)
    private String codigoGuia;

    @Column(name = "nombre_destinatario", nullable = false)
    private String nombreDestinatario;

    @Column(name = "direccion_destino", nullable = false)
    private String direccionDestino;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEncomienda estado = EstadoEncomienda.REGISTRADO;
}
