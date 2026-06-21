# feat: módulo de perfiles con preferencias de usuario

## Descripción

Implementación del módulo `ProfilesModule` para el microservicio de perfiles. Este módulo permite gestionar las preferencias de usuario (géneros musicales, ubicación y tipos de evento) que serán utilizadas para filtrar eventos en el mapa interactivo.

## Endpoints implementados

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/profiles/:userId/preferences` | Obtiene las preferencias de un usuario |
| `PUT` | `/profiles/:userId/preferences` | Crea o actualiza las preferencias de un usuario |

### Ejemplos de uso

**Crear/actualizar preferencias:**
```json
PUT /profiles/user123/preferences
{
  "preferredGenres": ["Rock", "Jazz"],
  "preferredLocation": "Santiago",
  "latitude": -33.4489,
  "longitude": -70.6693,
  "preferredEventTypes": ["concierto", "tocata"]
}
```

**Respuesta:**
```json
{
  "id": 1,
  "userId": "user123",
  "preferredGenres": ["Rock", "Jazz"],
  "preferredLocation": "Santiago",
  "latitude": -33.4489,
  "longitude": -70.6693,
  "preferredEventTypes": ["concierto", "tocata"],
  "createdAt": "2026-06-21T23:18:10.000Z",
  "updatedAt": "2026-06-21T23:18:10.000Z"
}
```

## Entidad: UserPreference

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` (PK) | Identificador único |
| `userId` | `string` (unique) | ID del usuario |
| `preferredGenres` | `string[]` (JSON) | Géneros musicales preferidos |
| `preferredLocation` | `string` | Nombre de la ubicación |
| `latitude` | `float` (nullable) | Latitud de la ubicación |
| `longitude` | `float` (nullable) | Longitud de la ubicación |
| `preferredEventTypes` | `string[]` (JSON) | Tipos de evento preferidos |
| `createdAt` | `Date` | Fecha de creación |
| `updatedAt` | `Date` | Fecha de actualización |

## Tecnologías agregadas

- **TypeORM** + **better-sqlite3** — Persistencia de datos (SQLite para desarrollo local)
- **class-validator** / **class-transformer** — Validación y transformación de DTOs
- **ValidationPipe** global con `whitelist: true` — Seguridad y sanitización de entrada

## Estructura del módulo

```
src/profiles/
├── entities/
│   └── user-preference.entity.ts
├── dto/
│   └── update-preferences.dto.ts
├── profiles.module.ts
├── profiles.controller.ts
└── profiles.service.ts
```

## Pendiente: Integración con microservicio "maps"

Los siguientes endpoints de búsqueda de eventos quedan como **TODO** hasta integrar el microservicio "maps" vía API Gateway:

- `GET /profiles/events/search?genre=&eventType=&latitude=&longitude=&radiusKm=`
- `GET /profiles/events`

El método `ProfilesService.searchEvents()` contiene un TODO con la especificación del endpoint esperado del microservicio `maps`.

## Cómo ejecutar

```bash
npm install
npm run build
npm run start:dev
```

El servidor se levanta en `http://localhost:3000`. La base de datos SQLite se crea automáticamente en `data/profile.db`.
