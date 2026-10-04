# Roxiler Store Ratings

A web app where users can rate stores registered on the platform (1 to 5). There is a single login for everyone, and what you can do depends on your role:

- **System Administrator**: manages users and stores, and sees platform stats
- **Normal User**: signs up, browses stores, and submits or updates ratings
- **Store Owner**: sees who rated their store and its average rating

## Tech Stack

- **Backend:** Node.js, Express 5, Sequelize
- **Database:** PostgreSQL 16 (runs in Docker)
- **Frontend:** React 19, Vite, React Router, Axios
- **Auth:** JWT and bcrypt password hashing

## Project Structure

```
Roxiler-Store/
├── docker-compose.yml        # PostgreSQL container
├── backend/
│   └── src/
│       ├── config/           # database connection
│       ├── models/           # User, Store, Rating and their relations
│       ├── controllers/      # request handlers
│       ├── routes/           # auth, admin, stores, owner
│       ├── middlewares/      # auth, role check, validation
│       ├── validators/       # request validation rules
│       ├── utils/            # filtering, sorting and rating helpers
│       └── scripts/          # admin seed script
└── frontend/
    └── src/
        ├── api/              # axios client
        ├── context/          # auth state
        ├── hooks/            # useAuth, useApi, useDebounce
        ├── components/       # table, modal, form field, stars...
        └── pages/            # login, signup, admin, user, owner
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- Docker Desktop

### 1. Start the database

```bash
docker compose up -d
```

PostgreSQL is exposed on port **5434** so it doesn't clash with a local Postgres install.

### 2. Run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed      # creates the first admin account
npm run dev
```

The API runs on `http://localhost:5000`. Tables are created automatically when the server starts.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the backend, so no extra config is needed.

### Default admin login

| Email | Password |
|---|---|
| admin@roxiler.com | Admin@123 |

You can change these in `backend/.env` before running `npm run seed`. Store owners and other admins are created by the admin from the Users page. Normal users can sign up themselves.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | API port | `5000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5434` |
| `DB_NAME` | Database name | `roxiler_store` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | Secret used to sign tokens | — |
| `JWT_EXPIRES_IN` | Token lifetime | `1d` |
| `ADMIN_EMAIL` | Email for the seeded admin | — |
| `ADMIN_PASSWORD` | Password for the seeded admin | — |

## Database Schema

**users**: `id`, `name`, `email` (unique), `password` (hashed), `address`, `role` (`admin` / `user` / `owner`), timestamps

**stores**: `id`, `name`, `email` (unique), `address`, `owner_id` → users, timestamps

**ratings**: `id`, `rating` (1–5), `user_id` → users, `store_id` → stores, timestamps

- `(user_id, store_id)` is unique, so a user has one rating per store and changing it updates the existing row.
- Deleting a user or store also deletes its ratings. Deleting an owner leaves the store without an owner.
- Average ratings are calculated in the database, not stored, so they are always up to date.

## API Reference

All routes except signup and login need an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register as a normal user |
| POST | `/api/auth/login` | Login for all roles |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/password` | Change password (`currentPassword`, `newPassword`) |

### Admin (`admin` only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Total users, stores and ratings |
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users` | Add a user with any role |
| GET | `/api/admin/users/:id` | User details, including rating for store owners |
| GET | `/api/admin/stores` | List stores with average rating |
| POST | `/api/admin/stores` | Add a store, optionally with an owner |

### Normal User (`user` only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stores` | List stores with overall rating and your rating |
| PUT | `/api/stores/:id/rating` | Submit or update your rating (`{ "rating": 1-5 }`) |

### Store Owner (`owner` only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/owner/dashboard` | Store info, average rating and list of ratings |

### Filtering and Sorting

List endpoints accept query parameters:

- **Filters:** `name`, `email`, `address` (partial and case-insensitive), `role` (exact)
- **Sorting:** `sortBy=<field>&order=asc|desc`

Example: `/api/admin/users?role=owner&sortBy=email&order=desc`

## Validation Rules

These are checked on both the frontend and the backend:

| Field | Rule |
|---|---|
| Name | 20 to 60 characters |
| Address | Required, max 400 characters |
| Password | 8 to 16 characters, at least one uppercase letter and one special character |
| Email | Valid email format |
| Rating | Whole number from 1 to 5 |
