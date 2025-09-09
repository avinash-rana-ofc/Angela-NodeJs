import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "root",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function checkVisitedByUser(userId) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [userId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// async function checkUsers(userId) {
//   //console.log(userId)
//   const results = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
//   if (results.rows.length === 0) {
//     return users;
//   }

//   return results.rows;
// }

async function getAllUsers() {
  const results = await db.query("SELECT * FROM users");
  if (results.rows.length === 0) {
    return users;
  }

  return results.rows;
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const users = await getAllUsers();
  console.log(countries, users)
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    //console.log(req.body)
    const countryCode = data.country_code;

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  //console.log(req.body);
  if (req.body?.add) {
    return res.render("new.ejs");
  }

  const userId = parseInt(req.body.user);

  try {
    
    const results = await db.query(
      "SELECT * FROM visited_countries AS v JOIN users AS u ON v.user_id = u.id WHERE v.user_id = $1",
      [userId]
    );
    const user = await getAllUsers();
    const countries = await checkVisitedByUser(userId);
    currentUserId = userId;
    console.log(countries);

    res.render("index.ejs", {
      users: user,
      color: results.rows[0]?.color,
      total: results.rows.length,
      countries: countries,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/new", async (req, res) => {
  const { name, color } = req.body;

  const user = db.query(
    "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *",
    [name, color]
  );
  res.redirect("/");
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
