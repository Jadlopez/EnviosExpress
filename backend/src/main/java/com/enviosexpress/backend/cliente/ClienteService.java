package com.enviosexpress.backend.cliente;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteResponse> listarTodos() {
        return clienteRepository.findAll().stream()
                .map(ClienteResponse::from)
                .toList();
    }

    public ClienteResponse registrar(ClienteRequest request) {
        Cliente cliente = new Cliente();
        cliente.setNombre(request.nombre());
        cliente.setTelefono(request.telefono());
        cliente.setDireccion(request.direccion());

        return ClienteResponse.from(clienteRepository.save(cliente));
    }
}
