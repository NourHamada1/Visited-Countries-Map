import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "NourDBSQLServer",
  port: 5433,
});

db.connect();

const app = express();
const port = 3000;

let visited_countries = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    visited_countries = result.rows.map((row) => row.country_code); // Extract the country codes
    res.render("index.ejs", {
      countries: visited_countries,
      total: visited_countries.length,
    });
  } catch (err) {
    console.error("Error Executing query: ", err.stack);
    res.status(500).send("Database query failed");
  }
});

app.post("/add", async (req, res) => {
  const country = req.body.country;
  try {
    // Use parameterized query to prevent SQL injection
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      country,
    ]);
    visited_countries.push(country); // Update the visited_countries list

    res.render("index.ejs", {
      countries: visited_countries,
      total: visited_countries.length,
    });
  } catch (err) {
    console.error("Error Executing query: ", err.stack);
    res.status(500).send("Failed to add country");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
