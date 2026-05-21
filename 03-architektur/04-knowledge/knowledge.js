// knowledge.js
// ------------------------------------
// Lightweight Knowledge Layer
// ------------------------------------

import fs from 'fs/promises';

const DB_FILE = './preferences.json';

// Load preferences for a user
export async function loadUserPreferences(userId) {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const db = JSON.parse(data);
    return db[userId] || {};
  } catch {
    return {};
  }
}

// Save updated preferences
export async function saveUserPreferences(userId, prefs) {
  let db = {};

  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    db = JSON.parse(data);
  } catch {
    // file does not exist yet
  }

  db[userId] = prefs;
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}
