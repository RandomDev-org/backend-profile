# feat: módulo de historial de eventos para perfiles

## Descripción

Nuevo módulo `HistoryModule` dentro del microservicio de perfiles. Permite registrar y consultar el historial de eventos a los que un usuario ha asistido y eventos que ha realizado (como organizador o performer).

## Endpoints

### HTTP (desarrollo local)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/history/:userId` | Lista historial con filtros (`role`, `genre`, `from`, `to`, paginación) |
| `POST` | `/history/:userId` | Agrega una entrada al historial |
| `DELETE` | `/history/:userId/:entryId` | Elimina una entrada del historial |
| `GET` | `/history/:userId/stats` | Estadísticas: totales por rol y género |

### TCP (API Gateway)
| Pattern | Payload | Descripción |
|---------|---------|-------------|
| `{ cmd: 'get_user_history' }` | `{ userId, role?, genre?, from?, to?, page?, limit? }` | Lista historial |
| `{ cmd: 'add_history_entry' }` | `{ userId, eventId, role, notes? }` | Agrega entrada |
| `{ cmd: 'delete_history_entry' }` | `{ userId, entryId }` | Elimina entrada |
| `{ cmd: 'get_user_history_stats' }` | `{ userId }` | Estadísticas |

## Estructura

```
src/profiles/history/
├── dto/
│   ├── create-history-entry.dto.ts
│   └── history-query.dto.ts
├── history.controller.ts   # HTTP + @MessagePattern TCP
├── history.service.ts      # Envía commands TCP a MAPS_SERVICE
└── history.module.ts       # Cliente TCP para maps (misma config que profiles)
```

## Arquitectura

```
API Gateway (TCP) ←→ Profile Service (TCP:4002) ←→ Maps Service (TCP:4001)
                         ↕
                   HTTP :3000 (dev)
```

El módulo `HistoryModule` sigue el mismo patrón que `ProfilesModule`: expone endpoints HTTP para desarrollo y handlers TCP para el API Gateway, delegando la persistencia al microservicio **maps** mediante `ClientProxy`.
