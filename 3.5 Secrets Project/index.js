//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

let userAuthorized = false;

app.use(bodyParser.urlencoded({ extended: true }));

function auth(req, res, next) {
  const reqPassword = req.body["password"];
  const PASSWORD = "ILoveProgramming";
  if (reqPassword === PASSWORD) {
    userAuthorized = true;
  }

  next();
}

app.use(auth);

app.get("/", (req, res) => {
  userAuthorized = false;
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
  if (userAuthorized) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
