import express from "express";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
let week_type = "weekday";
let work_type = "work hard";

function weekTypeMiddleware(req, res, next) {
  const date = new Date();
  if (date.getDay() === 0 || date.getDay === 6) {
    week_type = "weekend";
    work_type = "have fun";
  }
  next();
}

app.use(weekTypeMiddleware);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    week_type,
    work_type,
  });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
