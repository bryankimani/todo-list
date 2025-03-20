const fs = require("fs");
const path = require("path");

// Load the existing db.json
const dbPath = path.join(__dirname, "database", "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Add default values for new fields
db.items = db.items.map((item) => ({
  ...item,
  createdAt: item.createdAt || new Date().toISOString(),
  updatedAt: item.updatedAt || new Date().toISOString()
}));

// Save the updated db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Migration complete: db.json updated with new fields.");