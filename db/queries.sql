DROP TABLE IF EXISTS books, reviews;

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255),
	author VARCHAR(255),
    date VARCHAR(255),
    coverSmall VARCHAR(255),
    coverLarge VARCHAR(255),
    numRatings INTEGER,
    ratingSum INTEGER,
    avgRating NUMERIC(2, 1)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer VARCHAR(255),
    review TEXT,
    rating INTEGER,
    date DATE,
    bookId INTEGER
);