# Envíos Express — Backend

API REST para la Plataforma Web de Gestión de Rutas y Trazabilidad de Encomiendas (Spring Boot + PostgreSQL).

Estado actual: **Release 1** del backlog — registro de usuarios, autenticación con JWT y gestión de roles (RF-01, RF-02, RF-14, RNF-04).

## Requisitos

- Java 21+
- Una base de datos PostgreSQL accesible (por ejemplo, un proyecto en [Neon](https://neon.tech))

No necesitas tener Maven instalado: el proyecto incluye Maven Wrapper (`mvnw` / `mvnw.cmd`).

## Configuración

1. Copia `.env.example` a `.env` y completa los valores:

   ```
   SERVER_PORT=8080
   DB_URL=jdbc:postgresql://<host>:5432/<database>?sslmode=require
   DB_USERNAME=
   DB_PASSWORD=
   JWT_SECRET=
   JWT_EXPIRATION_MS=86400000
   FRONTEND_ORIGIN=http://localhost:5173
   ```

   - `JWT_SECRET` debe ser una cadena larga y aleatoria (ej. `openssl rand -base64 64`).
   - `.env` está en `.gitignore` — nunca se sube al repositorio.

2. El proyecto carga `.env` automáticamente al arrancar (vía `spring-dotenv`).

## Ejecutar en desarrollo

```bash
./mvnw spring-boot:run
```

En Windows (cmd/PowerShell): `mvnw.cmd spring-boot:run`

La API queda disponible en `http://localhost:8080/api/v1`.
Documentación Swagger: `http://localhost:8080/swagger-ui.html`.

## Endpoints (Release 1)

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| POST | `/api/v1/auth/register` | público | Registra un usuario (RF-01) |
| POST | `/api/v1/auth/login` | público | Autentica y devuelve `{ token, rol }` (RF-02) |
| GET | `/api/v1/usuarios` | ADMIN | Lista usuarios y sus roles (RF-14) |
| PUT | `/api/v1/usuarios/{id}/rol` | ADMIN | Cambia el rol de un usuario (RF-14) |

Roles soportados: `ADMIN`, `DESPACHADOR`, `CONDUCTOR`, `CLIENTE`.

## Notas

- `spring.jpa.hibernate.ddl-auto=update`: la tabla `usuarios` se crea/actualiza automáticamente al arrancar. Para producción real se recomendaría migrar a Flyway/Liquibase, pero para el alcance de prototipo del proyecto esto es suficiente.
- El login con Google (que el frontend ya tiene en la UI) **no está implementado en este backend** — no está en los requerimientos funcionales (RF-01/RF-02 solo piden credenciales). Se puede agregar más adelante si se decide incluirlo en el alcance.
