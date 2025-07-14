import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

function customizeMiddleware(req, res, next) {
  console.log(req.body);
  const street = req.body.street;
  const petName = req.body.pet;
  const h1 = "<h1>Your Brand name is: </h1>";
  const h2 = `<h3>${street}${petName}</h3>`;
  res.send(h1 + h2);
  next();
}
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", customizeMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
