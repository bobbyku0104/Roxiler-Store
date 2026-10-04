# Store Rating Platform

A full-stack web app where users rate registered stores from 1 to 5. One login serves three roles — **System Administrator**, **Normal User** and **Store Owner** — each with its own dashboard and permissions.

**Stack:** React 19 + Vite + Tailwind CSS · Node.js + Express 5 · PostgreSQL 16 · JWT + bcrypt · JavaScript

---

## Quick start

**Prerequisites:** Node.js 18+, and either Docker or a local PostgreSQL server.

```bash
# 1. Database (PostgreSQL in Docker, exposed on localhost:5433)
docker compose --env-file backend/.env.example up -d

# 2. Backend  →  http://localhost:5000
cd backend
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run db:setup              # creates the database, runs migrations, seeds demo data
npm run dev

# 3. Frontend  →  http://localhost:5173   (in a second terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Using your own PostgreSQL instead of Docker? Set `DB_HOST`, `DB_PORT`, `DB_USER` and `DB_PASSWORD` in `backend/.env`; `npm run db:setup` creates the `store_rating` database if it doesn't exist.

If port 5433 is already taken, change `DB_PORT` in `backend/.env` and start the database with `docker compose --env-file backend/.env up -d` instead.

### Demo accounts

The administrator account comes from `backend/.env`:

```env
ADMIN_NAME=System Administrator Account   # 20-60 characters
ADMIN_EMAIL=admin@storerating.com
ADMIN_PASSWORD=Admin@123                  # 8-16 chars, 1 uppercase, 1 special character
```

`npm run db:seed` creates this admin, or updates its name and password if the email already exists, so changing these values and re-running the seed applies them. The seed refuses to run if they break the validation rules. If you change `ADMIN_EMAIL`, a new admin is created and the old one stays.

| Role | Email | Password |
|---|---|---|
| System Administrator | value of `ADMIN_EMAIL` (default `admin@storerating.com`) | value of `ADMIN_PASSWORD` (default `Admin@123`) |
| Store Owner (Fresh Mart Supermarket) | `owner1@storerating.com` | `Owner@123` |
| Store Owner (Urban Style Clothing) | `owner2@storerating.com` | `Owner@123` |
| Normal User | `user1@storerating.com` · `user2@…` · `user3@…` | `User@1234` |

Demo accounts are not created when `NODE_ENV=production`; only the admin is.

### Backend scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the API with auto-reload (`node --watch`) |
| `npm start` | Start the API |
| `npm run db:migrate` | Create the database if needed and apply pending migrations |
| `npm run db:seed` | Insert demo data (safe to re-run) |
| `npm run db:setup` | `db:migrate` + `db:seed` |
| `npm run db:reset` | Drop everything and run `db:setup` again (refuses when `NODE_ENV=production`) |

---

## Features by role

**System Administrator**
- Dashboard with total users, stores and submitted ratings
- Add users of any role (name, email, password, address, role)
- Add stores and assign an owner (only store owners without a store are offered)
- Users list: name, email, address, role — filter by each, sort by each column
- Stores list: name, email, address, rating — filter and sort
- User details, including the store's rating when the user is a store owner

**Normal User**
- Sign up, log in, change password
- Store list with overall rating, their own rating, and a 1–5 star control to submit or update it
- Search by store name and by address; sort by name, address, overall rating or own rating

**Store Owner**
- Dashboard with the store's average rating and total ratings
- Table of customers who rated the store (name, email, rating, last updated), sortable

**Everyone:** log out; change password; all tables sort ascending/descending; responsive layout (tables become cards on phones).

---

## Form validation

Enforced in the browser for instant feedback, again by the API (express-validator), and finally by database constraints.

| Field | Rule |
|---|---|
| Name (people) | 20–60 characters |
| Store name | 1–60 characters |
| Address | Optional, max 400 characters |
| Password | 8–16 characters, at least one uppercase letter and one special character |
| Email | Valid email format; stored lowercase; unique |
| Rating | Whole number 1–5 |

---

## Architecture

```
├── docker-compose.yml          PostgreSQL 16 for local development
├── backend/src
│   ├── config/                 env loading + validation, pg connection pool
│   ├── db/                     migrations/*.sql, migrate.js, seed.js, reset.js
│   ├── middleware/             authenticate/authorize, validate, rate limits, error handler
│   ├── validators/             express-validator rules (shared field rules in common.validators.js)
│   ├── services/               business logic and SQL
│   ├── controllers/            HTTP in/out only
│   ├── routes/                 /auth, /admin, /stores, /owner
│   ├── utils/                  ApiError, roles, validation rules, safe filter/sort SQL builders
│   ├── app.js                  Express app
│   └── server.js               HTTP server + graceful shutdown
└── frontend/src
    ├── api/                    axios client (token + 401 handling) and one module per API area
    ├── context/                AuthContext (session), ToastContext (notifications)
    ├── hooks/                  useForm, useFetch, useFilters, useSort, useDebounce, useAuth, useToast
    ├── components/             DataTable, FilterBar, FormField, StarRating, RatingControl, Navbar, route guards…
    ├── pages/                  auth/, admin/, user/, owner/, common/
    └── utils/                  validators (mirror of the backend rules), formatting, roles
```

### Database

```
users    (id, name, email UNIQUE, password_hash, address, role ENUM('ADMIN','USER','OWNER'), token_version, created_at, updated_at)
stores   (id, name, email UNIQUE, address, owner_id → users UNIQUE NULL, created_at, updated_at)
ratings  (id, user_id → users, store_id → stores, rating 1–5, created_at, updated_at, UNIQUE(user_id, store_id))
```

- One rating per user per store (`UNIQUE(user_id, store_id)`); submitting again updates it via an upsert.
- One store per owner (`UNIQUE(owner_id)`).
- Average ratings are computed with `AVG()` at query time, so they can never drift out of sync.
- CHECK constraints back up the validation rules; `updated_at` is maintained by triggers.
- Deleting a user or store cascades to their ratings; deleting an owner un-assigns their store.

### Authentication and authorization

1. Login returns a JWT (`sub` = user id, `role`, `ver` = token version, 1-day expiry). Passwords are hashed with bcrypt.
2. The frontend keeps the token in `localStorage` and sends it as `Authorization: Bearer …`; any 401 logs the user out.
3. On every request the API verifies the token **and re-reads the user from the database**, so deleted accounts and role changes take effect immediately.
4. Changing the password bumps `token_version`, which signs the account out of every other session; the current session receives a fresh token.
5. `authorize(...roles)` guards each route group; the React router mirrors this and sends users to their own home page if they open another role's URL.
6. Login returns the same message (and takes the same time) for an unknown email and a wrong password.

### Search, filtering and sorting

All filtering and sorting happens in SQL. Filters are case-insensitive "contains" matches with LIKE wildcards escaped. `sortBy` is validated against a per-endpoint whitelist and mapped to a fixed SQL expression — user input never reaches `ORDER BY`. Unrated stores sort last in both directions. Filter inputs are debounced (300 ms).

### Security

- Every query is parameterised; sort columns come from a whitelist.
- Security headers via `helmet`; CORS is limited to `CORS_ORIGIN`; JSON bodies are capped at 10 kB.
- Rate limits: 10 failed logins per 15 minutes, 30 sign-ups per hour, 300 API requests per minute (per IP).
- JWTs are verified with a pinned algorithm (HS256); in production the server refuses to start with a `JWT_SECRET` shorter than 32 characters.
- The database port is bound to `127.0.0.1` only.

---

## API reference

All endpoints are under `/api`. Errors share one shape: `{ "message": "...", "errors": [{ "field": "...", "message": "..." }] }` (`errors` only on validation failures). Status codes: 400 validation, 401 not logged in, 403 wrong role, 404 not found, 409 duplicate, 429 rate limited.

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/health` | — | API + database status |
| POST | `/auth/signup` | — | Register a normal user → `{ token, user }` |
| POST | `/auth/login` | — | → `{ token, user }` |
| GET | `/auth/me` | any | Current user |
| PUT | `/auth/password` | any | `{ currentPassword, newPassword }` → `{ message, token }` |
| GET | `/admin/dashboard` | ADMIN | `{ totalUsers, totalStores, totalRatings }` |
| GET | `/admin/users` | ADMIN | `?name=&email=&address=&role=&sortBy=name\|email\|address\|role\|createdAt&order=asc\|desc` |
| GET | `/admin/users/:id` | ADMIN | User details; owners include `store { name, averageRating, ratingCount }` |
| POST | `/admin/users` | ADMIN | `{ name, email, password, address?, role }` |
| GET | `/admin/stores` | ADMIN | `?name=&email=&address=&sortBy=name\|email\|address\|rating\|createdAt&order=` |
| POST | `/admin/stores` | ADMIN | `{ name, email, address?, ownerId? }` |
| GET | `/admin/owners` | ADMIN | Store owners with a `hasStore` flag (for the owner picker) |
| GET | `/stores` | USER | `?name=&address=&sortBy=name\|address\|rating\|myRating&order=` — includes `averageRating`, `ratingCount`, `myRating` |
| PUT | `/stores/:storeId/rating` | USER | `{ rating }` — creates (201) or updates (200) the user's rating |
| GET | `/owner/dashboard` | OWNER | `?sortBy=name\|email\|rating\|ratedAt&order=` → `{ store, raters }` (`store` is null if none assigned) |

---

## Design decisions

- **Store names are exempt from the 20-character minimum.** That rule describes people's names; applying it would reject real store names like "Book Nook Corner".
- **Store ↔ owner link:** an admin first creates a Store Owner user, then assigns them when creating the store. Each owner has at most one store.
- **The admin user list shows all roles** (including store owners); the role filter narrows it.
- **Normal users search by name and address separately,** and the two filters combine.
- **Express 5** forwards errors from async handlers natively, so there is no `asyncHandler` wrapper.
- **No UI component library** — Tailwind utility classes plus a handful of small reusable components.
