import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "123456",
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

// app.get("/", async (req, res) => {

//   try {
//     const result = await db.query("SELECT * FROM items ORDER BY id ASC");
//     items = result.rows;


//     res.render("index.ejs", {
//       listTitle: "Today",
//       listItems: items,
//     });
//   }
//   catch (err) {
//     console.log(err);
//   }
// });

// app.post("/add", async (req, res) => {
//   const item = req.body.newItem;
//   try {
//     await db.query("INSERT Into items (title) Values ($1)", [item]);
//     res.redirect("/");
//   }
//   catch (err) {
//     console.log(err);
//   }

// });

// app.post("/edit", async (req, res) => {
//   const item = req.body.updatedItemTitle;
//   const id = req.body.updatedItemId;
//   try {
//     await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
//     res.redirect("/");
//   }
//   catch (err) {
//     console.log(err);
//   }
// });

// app.post("/delete", async (req, res) => {
//   const id = req.body.deleteItemId;

//   try {
//     await db.query("Delete From items Where id=$1", [id]);
//     res.redirect("/");
//   }
//   catch (err) {
//     console.log(err);
//   }
// });


app.get("/", async (req, res) => {
  res.redirect("/daily");
});

app.get("/daily", async (req, res) => {
  const result = await db.query("SELECT * FROM items WHERE category = 'daily' ORDER BY id ASC");
  res.render("index.ejs", {
    listTitle: "Daily",
    listItems: result.rows,
    category: "daily",
  });
});

app.get("/weekly", async (req, res) => {
  const result = await db.query("SELECT * FROM items WHERE category = 'weekly' ORDER BY id ASC");
  res.render("index.ejs", {
    listTitle: "Weekly",
    listItems: result.rows,
    category: "weekly",
  });
});

app.get("/monthly", async (req, res) => {
  const result = await db.query("SELECT * FROM items WHERE category = 'monthly' ORDER BY id ASC");
  res.render("index.ejs", {
    listTitle: "Monthly",
    listItems: result.rows,
    category: "monthly",
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const category = req.body.category;

  try {
    await db.query("INSERT INTO items (title, category) VALUES ($1, $2)", [item, category]);
    res.redirect("/" + category);
  } catch (err) {
    console.log(err);
  }
});


app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  const category = req.body.category;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect("/" + category);
  } catch (err) {
    console.log(err);
  }
});


app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  const category = req.body.category;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/" + category);
  } catch (err) {
    console.log(err);
  }
});




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
