const { Pool } = require('pg');
const axios = require('axios');

// The Pool will automatically use the environment variables
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BookDB",
  password: "340167",
  port: 5432,
});

async function createDB() {
  try {
  const response = await axios.get("https://openlibrary.org/subjects/love.json?limit=20");
  const books = response.data.works;
  books.forEach((book) => {
    addBook(book);
  });
}
catch (error) {
  console.error("Failed to make request:", error.message);
}};

async function addBook(book) {
  const id = (book.key).substring(6);
  await pool.query("INSERT INTO books (title, author, date, coverSmall, coverLarge) VALUES ($1, $2, $3, $4, $5)", [book.title, book.authors[0].name, book.first_publish_year, "https://covers.openlibrary.org/w/olid" + id + "-M.jpg", "https://covers.openlibrary.org/w/olid" + id + "-L.jpg"]);
};

createDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
