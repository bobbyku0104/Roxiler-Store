-- Every token carries the version it was issued with. Changing the password bumps
-- the version, which signs the account out of every other session.
ALTER TABLE users
  ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0;
