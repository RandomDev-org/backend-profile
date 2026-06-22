# Profile Microservice

## Purpose
Manages user profiles, preferences, history, and authentication.

## Capabilities

### User Profiles
- Entity: `Profile` with UUID PK, name, username, email, phoneNumber, password (hashed), preferences
- CRUD via HTTP endpoints under `/profiles`
- Auth: `auth.register` (create + JWT), `auth.login` (validate + JWT)

### User Preferences
- Entity: `UserPreference` with preferredGenres, preferredLocation, latitude, longitude, preferredEventTypes
- TCP handlers: `get_user_preferences`, `update_user_preferences`

### Browsing History
- Entity: `HistoryEntry` with userId, eventId, role, genre, notes
- TCP handlers: `get_user_history`, `add_history_entry`, `delete_history_entry`, `get_user_history_stats`

### Authentication
- Register: bcrypt hash, JWT token (7d expiry)
- Login: credential validation, JWT token
- Token validation: `auth.validate_token`

## Non-Functional Requirements
- Hybrid: HTTP (3002 dev) + TCP (4002)
- PostgreSQL database: `profile_db`
- JWT secret via environment variable
