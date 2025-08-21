import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  host : "localhost",
  database : "world",
  user : "postgres",
  password : "root",
  port : 5432
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("SELECT country_code FROM visited_countries");
   
  if(result.rows.length === 0){
    console.error(result.rows)
  }
  
  const countries = result.rows.map((country) => country.country_code )
  res.render("index.ejs", {countries, total : countries.length});
  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
