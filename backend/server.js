require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL kapcsolat
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "fruitdb",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL csatlakozási hiba:", err);
    return;
  }
  console.log("Sikeresen csatlakozva a MySQL adatbázishoz!");
});

// Gyümölcsök lekérdezése
app.get("/fruits", (req, res) => {
  db.query("SELECT * FROM fruits", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Egy adott gyümölcs lekérdezése ID alapján
app.get("/fruits/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM fruits WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || {});
  });
});

// Új gyümölcs hozzáadása
app.post("/fruits", (req, res) => {
  const { name, quantity, price } = req.body;
  db.query(
    "INSERT INTO fruits (name, quantity, price) VALUES (?, ?, ?)",
    [name, quantity, price],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, name, quantity, price });
    }
  );
});

// Gyümölcs adatainak módosítása
app.put("/fruits/:id", (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;
  db.query(
    "UPDATE fruits SET name=?, quantity=?, price=? WHERE id=?",
    [name, quantity, price, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Gyümölcs frissítve!" });
    }
  );
});

// Gyümölcs törlése
app.delete("/fruits/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM fruits WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Gyümölcs törölve!" });
  });
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});
