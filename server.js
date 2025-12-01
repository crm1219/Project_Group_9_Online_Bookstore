// Loads .env variables when needed
require('dotenv').config();
const express = require("express");
const path = require("path");

const app = express();

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "ejsTemplate", "views"));

// Serve static files (CSS, images, JS) from 'ejsTemplate/public'
app.use(express.static(path.join(__dirname, "ejsTemplate", "public")));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// Require home route 
const homeRoute = require("./ejsTemplate/routes/home");
app.use("/", homeRoute);

// Start server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
