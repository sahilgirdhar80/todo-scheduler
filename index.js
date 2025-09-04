import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const sql = neon(process.env.DATABASE_URL);

// ✅ Ensure table exists at startup
(async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL
      )
    `;
    console.log("✅ Table 'items' ready.");
  } catch (err) {
    console.error("❌ Error ensuring table:", err);
  }
})();

// Default redirect
app.get("/", (req, res) => {
  res.redirect("/daily");
});

// DAILY LIST
app.get("/daily", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM items WHERE category = 'daily' ORDER BY id ASC`;
    res.render("index.ejs", {
      listTitle: "Daily",
      listItems: result,
      category: "daily",
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading daily items.");
  }
});

// WEEKLY LIST
app.get("/weekly", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM items WHERE category = 'weekly' ORDER BY id ASC`;
    res.render("index.ejs", {
      listTitle: "Weekly",
      listItems: result,
      category: "weekly",
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading weekly items.");
  }
});

// MONTHLY LIST
app.get("/monthly", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM items WHERE category = 'monthly' ORDER BY id ASC`;
    res.render("index.ejs", {
      listTitle: "Monthly",
      listItems: result,
      category: "monthly",
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading monthly items.");
  }
});

// ADD ITEM
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const category = req.body.category;

  try {
    await sql`INSERT INTO items (title, category) VALUES (${item}, ${category})`;
    res.redirect("/" + category);
  } catch (err) {
    console.error(err);
    res.send("Error adding item.");
  }
});

// EDIT ITEM
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  const category = req.body.category;

  try {
    await sql`UPDATE items SET title = ${item} WHERE id = ${id}`;
    res.redirect("/" + category);
  } catch (err) {
    console.error(err);
    res.send("Error editing item.");
  }
});

// DELETE ITEM
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  const category = req.body.category;

  try {
    await sql`DELETE FROM items WHERE id = ${id}`;
    res.redirect("/" + category);
  } catch (err) {
    console.error(err);
    res.send("Error deleting item.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
