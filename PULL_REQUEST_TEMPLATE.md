# feat: módulo de perfiles con preferencias de usuario

## Descripción

Implementación del módulo `ProfilesModule` para el microservicio de perfiles. Permite gestionar las preferencias de usuario (géneros musicales, ubicación y tipos de evento) utilizadas para filtrar eventos en el mapa interactivo.

La comunicación entre microservicios se realiza mediante **TCP** (NestJS microservices). Este servicio se conecta al API Gateway por TCP y también expone HTTP para desarrollo local.

## Endpoints

### HTTP (desarrollo local)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/profiles/:userId/preferences` | Obtiene preferencias de un usuario |
| `PUT` | `/profiles/:userId/preferences` | Crea o actualiza preferencias |

### TCP (API Gateway)
| Pattern | Payload | Descripción |
|---------|---------|-------------|
| `{ cmd: 'get_user_preferences' }` | `{ userId: string }` | Obtiene preferencias |
| `{ cmd: 'update_user_preferences' }` | `{ userId, preferredGenres, ... }` | Actualiza preferencias |

## Arquitectura

```
API Gateway (TCP) ←→ Profile Service (TCP:4002) ←→ Maps Service (TCP:4001)
                         ↕
                   HTTP :3000 (dev)
```

- **Profile Service** recibe mensajes TCP desde el Gateway y responde vía TCP
- Para persistencia, envía mensajes TCP al **Maps Service** (`{ cmd: 'get_preferences' }` / `{ cmd: 'upsert_preferences' }`), que maneja PostgreSQL
- Variables de entorno: `PROFILES_TCP_PORT`, `MAPS_HOST`, `MAPS_TCP_PORT`

## Cómo ejecutar

```bash
npm install
npm run build
# Iniciar (requiere Maps Service corriendo en TCP:4001)
npm run start:dev
```

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto HTTP local |
| `PROFILES_HOST` | `0.0.0.0` | Host TCP |
| `PROFILES_TCP_PORT` | `4002` | Puerto TCP para Gateway |
| `MAPS_HOST` | `localhost` | Host del Maps Service |
| `MAPS_TCP_PORT` | `4001` | Puerto TCP del Maps Service |
