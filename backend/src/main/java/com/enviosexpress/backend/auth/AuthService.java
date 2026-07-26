package com.enviosexpress.backend.auth;

import com.enviosexpress.backend.auth.dto.AuthResponse;
import com.enviosexpress.backend.auth.dto.LoginRequest;
import com.enviosexpress.backend.auth.dto.RegisterRequest;
import com.enviosexpress.backend.exception.ApiException;
import com.enviosexpress.backend.security.JwtService;
import com.enviosexpress.backend.usuario.Rol;
import com.enviosexpress.backend.usuario.Usuario;
import com.enviosexpress.backend.usuario.UsuarioRepository;
import com.enviosexpress.backend.usuario.UsuarioResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import java.security.SecureRandom;
import java.util.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final GoogleTokenVerifier googleTokenVerifier;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            GoogleTokenVerifier googleTokenVerifier
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    public UsuarioResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "El correo ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(request.rol() != null ? request.rol() : Rol.CLIENTE);

        return UsuarioResponse.from(usuarioRepository.save(usuario));
    }

    public AuthResponse iniciarSesion(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));

        String token = jwtService.generateToken(usuario, usuario.getRol().name());
        return new AuthResponse(token, usuario.getRol().name());
    }

    public AuthResponse iniciarSesionConGoogle(String idToken) {
        GoogleIdToken.Payload payload = googleTokenVerifier.verificar(idToken);

        String email = payload.getEmail();
        if (email == null || !Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "La cuenta de Google no tiene un correo verificado.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> registrarDesdeGoogle(email, (String) payload.get("name")));

        String token = jwtService.generateToken(usuario, usuario.getRol().name());
        return new AuthResponse(token, usuario.getRol().name());
    }

    private Usuario registrarDesdeGoogle(String email, String nombre) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre != null && !nombre.isBlank() ? nombre : email);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(generarPasswordAleatoria()));
        usuario.setRol(Rol.CLIENTE);
        return usuarioRepository.save(usuario);
    }

    private String generarPasswordAleatoria() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
