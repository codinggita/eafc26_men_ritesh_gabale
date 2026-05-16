# Indian Penal & Legal API Backend

Express and MongoDB backend for the `01.Indian_law_penal_code.md` API route contract.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URL` in `.env` before starting the server. The API is served from:

```text
http://localhost:5000/api/v1
```

## Structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
```

## Main Routes

- `GET /api/v1/health`
- `GET|POST /api/v1/laws`
- `GET|PUT|PATCH|DELETE /api/v1/laws/:id`
- `GET /api/v1/search/laws?q=keyword`
- `GET /api/v1/laws/filter/:type/:value`
- `GET /api/v1/analytics/laws/:metric`
- `GET /api/v1/stats/laws/count`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/profile`
- `POST /api/v1/jwt/verify-token`
- `GET /api/v1/admin/system/health`

## Dataset Collections

The law API can read across these MongoDB collections:

- `ida_pineal_code`
- `nia_pineal_code`
- `cpc_pineal_code`
- `hma_pineal_code`
- `iea_pineal_code`
- `mva_pineal_code`
- `ipc_pineal_code`
- `crpc_pineal_code`

When creating a law, pass `collection` or `act_short_name` in the request body to choose the collection. If omitted, the backend stores the record in `ipc_pineal_code`.
