# Shared Database - Profile Microservice

All three modules share a single PostgreSQL database (profile_db):

| Module | Directory | Entity | Table |
|--------|-----------|--------|-------|
| Profile (crear + editar) | src/profile/ | Profile | profile |
| Preferences | src/profiles/ | UserPreference | user_preference |
| History | src/profiles/history/ | HistoryEntry | history_entry |

Connection configured in AppModule via TypeOrmModule.forRootAsync().
Configurable through .env variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.

