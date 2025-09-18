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
const checkVisited = async() => {
    const result = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    if(result.rowCount !== 0){
      let data = result.rows;
      data.map(d => countries.push(d.country_code))
      return countries;
    }


}

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("SELECT country_code FROM visited_countries");
  checkVisited();
  if (result.rows.length === 0) {
    console.error("error", result.rows);
  }

  const countries = result.rows.map((country) => country.country_code);
  res.render("index.ejs", { countries, total: countries.length });
  //db.end();
});

let errorMsg = "";
app.post("/add", async (req, res) => {
  const { country } = req.body;
console.log("h")
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [country.toLowerCase()]
    );
console.log(result)
    if (result.rows.length !== 0) {
      try {
        const data = await db.query(
          "INSERT INTO visited_countries (country_code) VALUES ($1) RETURNING *",
          [result.rows[0].country_code]
        );

        if (data.rowCount === 1) {
          res.redirect("/");
        } else {
          console.log("not inserted");
        }
      } catch (error) {
        console.log(error)
        const countries = await checkVisited();
        if (error.constraint === "uq_country_code") {
          errorMsg =
            "Country has already been added, try again";
        }

        res.render("index.ejs", {
          error: errorMsg || error.message,
          total: 0,
          countries: [],
        });
      }
    }

    throw new error("Not Found")
  } catch (error) {
    console.log(error)
    const countries = await checkVisited();
    errorMsg = "Country does not exist, try again"
    res.render("index.ejs", {
      error: errorMsg || error.message,
      total: countries.length,
      countries: countries,
    });
  }

  //res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
