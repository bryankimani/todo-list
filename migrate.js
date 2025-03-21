const fs = require("fs");
const path = require("path");

// Load the existing db.json
const dbPath = path.join(__dirname, "database", "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Define the new lists array
const lists = [
  { id: "1", name: "Personal" },
  { id: "2", name: "Work" },
  { id: "3", name: "School Work" }
];

// Map over the existing items and update their structure
const updatedItems = db.items.map((item, index) => {
  // Assign a unique ID as a string (use the original ID or generate a new one)
  const itemId = String(item.id || index + 1);

  // Assign a listId based on some logic (e.g., distribute items across lists)
  const listId = ["1", "2"][index % 2]; // Alternate between "1" and "2"

  // Return the updated item with new fields
  return {
    id: itemId,
    heading: item.heading,
    body: item.body,
    isComplete: item.isComplete,
    listId: listId,
  createdAt: item.createdAt || new Date().toISOString(),
  updatedAt: item.updatedAt || new Date().toISOString()
}));

// Save the updated db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Migration complete: db.json updated with new fields.");