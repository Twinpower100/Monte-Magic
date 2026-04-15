# PostgreSQL Init Folder

`docker/postgres/init/` is intentionally empty for this project.

Why:

- Monte Magic should start with a clean PostgreSQL 18 database
- Payload will create the schema itself on first connection
- demo content is loaded by `npm run seed`

Keep only `.gitkeep` here unless you explicitly want to preload SQL for this project.
