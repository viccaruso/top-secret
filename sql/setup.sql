-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS secrets;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE secrets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
  secrets (title, description)
VALUES
  ('Top Secret: Daniel Radcliffe / Elijah Wood ', 'It has been proven by top government officials that Daniel Radcliffe and Elijah Wood are indeed the same person.'),
  ('Top Secret: Pop Secret', 'It is just regular popcorn and there is no secret to it.'),
  ('Top Secret: Konami Code', 'The missile launch code is: up, up, down, down, left, right, left, right, B, A, Start');