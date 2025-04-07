import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "",
  port: 5433,
  database: "permalist",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  if (req.body.newItem) {
    await db.query("INSERT INTO items VALUES ($1, $2)", [
      items.length + 1,
      req.body.newItem,
    ]);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  if (req.body.updatedItemTitle) {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [
      req.body.updatedItemTitle,
      req.body.updatedItemId,
    ]);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await db.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
