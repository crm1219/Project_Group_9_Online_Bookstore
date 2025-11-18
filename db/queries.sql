DROP TABLE IF EXISTS books;

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255),
	author VARCHAR(255),
    date VARCHAR(255),
    coverSmall VARCHAR(255),
    coverLarge VARCHAR(255)
);