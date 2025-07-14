import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("<h1>This is a Home Page</h1>");
});

app.get("/contact", (req, res) => {
  res.send("<h2>Contact No: 7980009282</h2>");
});

app.get("/about", (req, res) => {
  res.send("<p>I am Software Developer. You can connect me.</p>");
});

app.get("/data", (req, res) => {
  console.log("data", req.rawHeaders);
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
