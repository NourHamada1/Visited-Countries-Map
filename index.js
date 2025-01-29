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
  //Write your code here.
  var result = await db.query(
    "SELECT country_code FROM visited_countries",
    (err, res) => {
      if (err) {
        console.error("Error Executing query: ", err.stack);
      } else {
        result = res.rows;
        visited_countries.push(result)
      }
      db.end();
    }
  );

  res.render("index.ejs", {
    countries: visited_countries,
    total: visited_countries.length,
  });
});

app.post("/add", async (req, res) => {
  var result = await db.query(
    `INSERT INTO visited_countries (country_code) VALUES (${req.body.country})`,
    (err, res) => {
      if (err) {
        console.error("Error Executing query: ", err.stack);
      } else {
        result = res.rows;
      }
      db.end();
    }
  );

  const visisted = req.body.country;
  visited_countries.push(visisted);

  console.log(visited_countries);

  res.render("index.ejs", {
    countries: visited_countries,
    total: visited_countries.length,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
