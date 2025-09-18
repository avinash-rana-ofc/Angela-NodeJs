import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  host: "localhost",
  database: "permalist",
  user: "postgres",
  password: "root",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

let items = [];
const TODO = "todolist";

let getItems = async (req, res, next) => {
  const data = await db.query(`SELECT * FROM ${TODO}`);
  console.log(data.rows);
  items = data.rows;
  next();
  //return data.rows;
};

app.get("/", getItems, async (req, res) => {
  res.render("index.ejs", {
    listTitle: "Today " + new Date().getDate(),
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    if (item.trim() === "") {
      throw new Error("Todo cannot be empty");
    }
    const data = await db.query(`INSERT INTO ${TODO} ( title ) VALUES ($1)`, [
      item.trim(),
    ]);
  } catch (error) {
    console.error("Error Inserting data", error);
  }
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body["updatedItemId"]);
  const title = req.body["updatedItemTitle"];
  try {
    const data = db.query(`UPDATE ${TODO} SET title = $1 WHERE id = $2`, [
      title,
      id,
    ]);

    return res.redirect("/");
  } catch (error) {
    console.error("Error updating", error);
  }
});

app.post("/delete", (req, res) => {
  const id = parseInt(req.body["deleteItemId"]);

  try {
    const data = db.query(`DELETE FROM ${TODO} WHERE id = $1`, [id]);
    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting data", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
