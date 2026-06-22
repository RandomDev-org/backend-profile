# feat: base de datos compartida para todo el microservicio de perfiles

## Descripción

Se implementó una base de datos **PostgreSQL compartida** para todos los módulos del microservicio de perfiles, reemplazando:
- Almacenamiento en memoria (`ProfileModule` → `Map<string, Profile>`)
- Delegación vía TCP a maps service (`ProfilesModule` → `ClientProxy MAPS_SERVICE`)

## Cambios por módulo

### ProfileModule (perfiles)
- `Profile` convertido de clase TypeScript a **entidad TypeORM** con `@Entity()`
- `ProfileService` ahora usa `@InjectRepository(Profile)` en lugar de un `Map` en memoria
- `preferences` se almacena como `simple-json` en PostgreSQL

### ProfilesModule (preferencias de usuario)
- Nueva entidad `UserPreference` con campos: `userId`, `preferredGenres`, `preferredLocation`, `latitude`, `longitude`, `preferredEventTypes`
- `ProfilesService` ahora usa `@InjectRepository(UserPreference)` en lugar de TCP a MAPS_SERVICE
- Se eliminó `ClientsModule` (ya no depende de maps service para preferencias)

### HistoryModule (historial de eventos)
- Sin cambios funcionales, ya usaba TypeORM
- Ahora comparte la misma conexión PostgreSQL que el resto del microservicio

## Estructura de la base de datos

```
Tablas en PostgreSQL (profile_db):
├── profile              # Perfiles de usuario (CRUD)
├── user_preference     # Preferencias de usuario (géneros, ubicación, tipos)
└── history_entry       # Historial de eventos del usuario
```

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto HTTP local |
| `PROFILES_HOST` | `0.0.0.0` | Host TCP |
| `PROFILES_TCP_PORT` | `4002` | Puerto TCP para API Gateway |
| `DB_HOST` | `localhost` | Host PostgreSQL |
| `DB_PORT` | `5432` | Puerto PostgreSQL |
| `DB_USER` | `postgres` | Usuario PostgreSQL |
| `DB_PASSWORD` | `postgres` | Contraseña PostgreSQL |
| `DB_NAME` | `profile_db` | Nombre de base de datos |
