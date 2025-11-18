const express = require("express");
const router = express.Router();

// Import the database connection
const db = require("../../db/db");

// Home page route
router.get("/", async (req, res) => {
    try {
        // Query the database to get all books
        const result = await db.query('SELECT * FROM books');
        
        // Pass the 'books' array to your 'home.ejs' template
        res.render("home", { books: result.rows });

    } catch (err) {
        console.error(err);
        res.send("Error fetching books.");
    }
});

// Book Details Page route
router.get("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Query for a single book by its ID
        const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        
        if (result.rows.length > 0) {
            // Render a new 'book.ejs' page
            res.render("book", { book: result.rows[0] });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        console.error(err);
        res.send("Error fetching book details.");
    }
});

module.exports = router;
