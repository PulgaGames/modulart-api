# ModulArt API (NestJS)

Backend de estudio para entrevista Node.js. Migra el catálogo y las cotizaciones de la landing estática de ModulArt a una API REST con capas, DI y PostgreSQL.

## Prerrequisitos

- Node **20+** (en esta máquina: `nvm use 22.16.0`)
- Por defecto usa **SQLite** (`modulart.sqlite`) para estudiar sin Docker.
- PostgreSQL queda listo con Docker: `DB_TYPE=postgres` + `docker compose up -d`

## Arranque

```bash
nvm use 22.16.0
cd C:\WorkSpaceVZ.0\DESPLIEGUEZ\CODEVS\ApiNode
npm install
npm run start:dev
```

- API: http://localhost:3000/api/v1/health
- Swagger: http://localhost:3000/docs

## Endpoints

| Método | Ruta | Status |
|--------|------|--------|
| GET | `/api/v1/health` | 200 |
| GET | `/api/v1/categories` | 200 |
| GET | `/api/v1/products?page=1&limit=5&category=closets` | 200 + paginación |
| GET | `/api/v1/products/:id` | 200 / 404 |
| POST | `/api/v1/products` | 201 |
| PATCH | `/api/v1/products/:id` | 200 |
| DELETE | `/api/v1/products/:id` | 204 |
| GET | `/api/v1/quotes` | 200 + paginación |
| POST | `/api/v1/quotes` | 201 (calcula ITBMS 7% en servidor) |
| PATCH | `/api/v1/quotes/:id/status` | 200 / 422 |
| DELETE | `/api/v1/quotes/:id` | 204 |

## Arquitectura (capas)

```
presentation  → controllers (HTTP)
application   → services (casos de uso)
domain        → entities + enums
infrastructure→ TypeORM repositories
```

Eso es **arquitectura en capas** con un toque hexagonal (el service no importa TypeORM: importa `ProductRepository`).

## Mapa rápido .NET → NestJS

| .NET | NestJS |
|------|--------|
| ASP.NET Core | NestJS |
| `Program.cs` / `Startup` | `AppModule` + `main.ts` |
| `[ApiController]` | `@Controller` |
| `[HttpGet]` | `@Get()` |
| `IServiceCollection.AddScoped` | `@Injectable()` + `providers` |
| constructor injection | constructor injection (igual) |
| EF Core `DbContext` | TypeORM `Repository<T>` |
| FluentValidation | `class-validator` + `ValidationPipe` |
| `ProblemDetails` | `HttpExceptionFilter` |
| `[Authorize]` | `Guard` |
| AutoMapper | `class-transformer` |
| `appsettings.json` | `.env` + `ConfigModule` |

Los tres sitios que revisamos (ModulArt, Big Boys Gym, Codevs IA) eran **frontend**. Ninguno era Node/Next. Este API es el backend que les faltaba.

## Render (producción)

1. Sube este repo a GitHub.
2. En Render: **New → Postgres** (`modulart-db`, misma región Ohio).
3. **New → Web Service** → conecta el repo.
   - Runtime: **Node**
   - Build: `npm install --include=dev && npm run build`
   - Start: `npm start`
   - Health check: `/api/v1/health`
4. Env vars: `DB_TYPE=postgres`, `DB_SSL=true`, `DB_SYNC=true`, `DATABASE_URL` = **Internal Database URL** del Postgres, `NODE_VERSION=22`.

