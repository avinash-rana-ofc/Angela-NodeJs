import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
let title = "<h1>Enter your name here!</h1>";

app.get("/", (req, res) => {
  res.render("index.ejs", { title });
});

app.post("/submit", (req, res) => {
  //console.log()
  const firstName = req.body["fName"];
  const lastName = req.body["lName"];
  const countLetters = firstName.length + lastName.length;
  res.render("index.ejs", {
    title: `<h1>There are ${countLetters} letters in your name.</h1>`,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
