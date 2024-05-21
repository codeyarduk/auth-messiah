DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username VARCHAR(32) NOT NULL,
  password VARCHAR(32) NOT NULL
);
INSERT INTO users (username, password) VALUES ('admin', 'admin');