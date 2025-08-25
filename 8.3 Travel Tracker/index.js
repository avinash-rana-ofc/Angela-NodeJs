import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  host: "localhost",
  database: "world",
  user: "postgres",
  password: "root",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const getCountry = async (req, res, next) => {
//   //db.connect();
//   const { country } = req.body;

//   const result = await db.query(
//     "SELECT country_code, country_name FROM countries WHERE country_name=$1",
//     [country]
//   );
//   //console.log(result.rows);
//   if (result.rows.length > 0) {
//     req.country = result.rows;
//     next();
//   }

//   res.render("index.ejs", { error: result.stack, total: result.rows.length });
// };

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("SELECT country_code FROM visited_countries");

  if (result.rows.length === 0) {
    console.error("error", result.rows);
  }

  const countries = result.rows.map((country) => country.country_code);
  res.render("index.ejs", { countries, total: countries.length });
  //db.end();
});

app.post("/add", async (req, res) => {
  const { country } = req.body;

  const result = await db.query(
    "SELECT country_code, country_name FROM countries WHERE country_name=$1",
    [country]
  );

  if (result.rows.length === 0) {
    console.log("in 0");
    res.render("index.ejs", {
      error: "No country found. Please try again with another search",
      total: result.rows.length,
      countries: result.rows,
    });
  } else {
    const data = await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1) RETURNING *",
      [result.rows[0].country_code]
    );

    if(data.rowCount === 1){
      res.redirect("/");
    }else{
          console.log("not inserted");

    }
  }


  //res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
