package com.enviosexpress.backend.auth;

import com.enviosexpress.backend.exception.ApiException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.security.GeneralSecurityException;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Verifica un ID Token de Google Sign-In (emitido por el boton "Acceder con
 * Google" del frontend) contra las claves publicas de Google, validando firma,
 * emisor y audiencia (nuestro Client ID) antes de confiar en su contenido.
 */
@Component
public class GoogleTokenVerifier {

    private final GoogleIdTokenVerifier verifier;
    private final boolean configurado;

    public GoogleTokenVerifier(@Value("${app.google.client-id}") String clientId) {
        this.configurado = clientId != null && !clientId.isBlank();
        this.verifier = configurado
                ? new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                        .setAudience(Collections.singletonList(clientId))
                        .build()
                : null;
    }

    public GoogleIdToken.Payload verificar(String idTokenString) {
        if (!configurado) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "El login con Google no está configurado en el servidor.");
        }
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Token de Google inválido o expirado.");
            }
            return idToken.getPayload();
        } catch (GeneralSecurityException | java.io.IOException | IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "No fue posible validar el token de Google.");
        }
    }
}
