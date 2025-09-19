import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const TABLE_NAME = "users";

const db = new pg.Client({
  host: "localhost",
  database: "secrets",
  user: "postgres",
  password: "root",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body["username"];
  const password = req.body["password"];

  try {
    const checkResult = await db.query(
      `SELECT * FROM ${TABLE_NAME} WHERE email=$1`,
      [email]
    );

    if (checkResult.rowCount > 0) {
      res.send("Email already exists. Please try again once more");
    } else {
      const data = await db.query(
        `INSERT INTO ${TABLE_NAME} (email, password) VALUES ($1, $2) RETURNING *`,
        [email, password]
      );
      console.log(data);
      if (data.rowCount === 1) {
        res.render("secrets.ejs");
      }
    }
  } catch (error) {
    console.error("Error creating users", error);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body["username"];
  const password = req.body["password"];

  try {
    const result = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE email=$1`, [email]);
    if(result.rowCount > 0){
      const user = result.rows[0];
      const storedPassword = user.password;

      if(storedPassword === password){
        res.render("secrets.ejs");
      }
      else{
        res.send("Password does not match. Try again.")
      }
    }
    else{
      res.send("Username does not exist");
    }
  } catch (error) {
    console.error("Error", error)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
