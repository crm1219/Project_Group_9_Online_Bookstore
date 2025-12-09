const express = require("express");
const router = express.Router();

// Import the database connection
const db = require("../../db/db");

// Home page route
router.get("/", async (req, res) => {
    try {
        const { search, sort } = req.query;
        
        let queryText = 'SELECT * FROM books';
        let params = [];

        if (search) {
            queryText += ' WHERE title ILIKE $1 OR author ILIKE $1';
            params.push(`%${search}%`);
        }

        if (sort === 'rating') {
            queryText += ' ORDER BY avgRating DESC NULLS LAST';
        } else if (sort === 'date') {
            queryText += ' ORDER BY date DESC';
        } else {
            queryText += ' ORDER BY id ASC';
        }

        const result = await db.query(queryText, params);
        
        res.render("home", { 
            books: result.rows,
            searchQuery: search || ''
        });

    } catch (err) {
        console.error(err);
        res.send("Error fetching books.");
    }
});

// Book Details Page route
router.get("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const bookResult = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        
        const reviewResult = await db.query('SELECT * FROM reviews WHERE bookId = $1 ORDER BY date DESC', [id]);

        if (bookResult.rows.length > 0) {
            res.render("book", { 
                book: bookResult.rows[0],
                reviews: reviewResult.rows
            });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        console.error(err);
        res.send("Error fetching book details.");
    }
});

// Post Route for reviews
router.post("/book/:id/review", async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewer, review, rating } = req.body;
        const currentDate = new Date();

        await db.query(
            'INSERT INTO reviews (reviewer, review, rating, date, bookId) VALUES ($1, $2, $3, $4, $5)',
            [reviewer, review, rating, currentDate, id]
        );

        const numRatingsResult = await db.query("SELECT numRatings FROM books WHERE id = $1", [id]);

        const ratingSumResult = await db.query("SELECT ratingSum FROM books WHERE id = $1", [id]);

        const newnumRatings = numRatingsResult.rows[0].numratings + 1;
        const newratingSum = ratingSumResult.rows[0].ratingsum + Number(rating);
        const newavgRating = newratingSum / newnumRatings;

        await db.query("UPDATE books SET numRatings = $1, ratingSum = $2, avgRating = $3 WHERE id = $4", [newnumRatings, newratingSum, newavgRating, id]
        );

        res.redirect(`/book/${id}`);

    } catch (err) {
        console.error("Error submitting review:", err);
        res.send("Error submitting review.");
    }
});
router.get("/", async (req, res) => {
    const searchQuery = req.query.search || "";

    let books;

    if (searchQuery.trim() === "") {
        
        books = await db.query("SELECT * FROM books");
    } else {
        books = await db.query(
            "SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1",
            [`%${searchQuery}%`]
        );
    }

    res.render("home", {
        books: books.rows,
        searchQuery
    });
});

module.exports = router;
