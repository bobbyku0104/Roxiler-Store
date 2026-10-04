CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'OWNER');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(60)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address       VARCHAR(400),
  role          user_role    NOT NULL DEFAULT 'USER',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_name_length CHECK (char_length(name) BETWEEN 20 AND 60),
  CONSTRAINT users_email_lowercase CHECK (email = lower(email))
);

CREATE TABLE stores (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(255) NOT NULL,
  address    VARCHAR(400),
  owner_id   INTEGER REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT stores_email_key UNIQUE (email),
  CONSTRAINT stores_owner_id_key UNIQUE (owner_id),
  CONSTRAINT stores_name_not_blank CHECK (char_length(trim(name)) > 0),
  CONSTRAINT stores_email_lowercase CHECK (email = lower(email))
);

CREATE TABLE ratings (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  store_id   INTEGER     NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  rating     SMALLINT    NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT ratings_user_store_key UNIQUE (user_id, store_id),
  CONSTRAINT ratings_value_range CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX ratings_store_id_idx ON ratings (store_id);
CREATE INDEX users_role_idx ON users (role);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER stores_set_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER ratings_set_updated_at
  BEFORE UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
