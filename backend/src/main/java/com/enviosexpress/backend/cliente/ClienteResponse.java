package com.enviosexpress.backend.cliente;

public record ClienteResponse(Long id, String nombre, String telefono, String direccion) {

    public static ClienteResponse from(Cliente cliente) {
        return new ClienteResponse(cliente.getId(), cliente.getNombre(), cliente.getTelefono(), cliente.getDireccion());
    }
}
