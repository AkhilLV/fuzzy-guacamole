const sqlite3 = require("sqlite3");
const crypto = require("crypto");

const db = new sqlite3.Database("./dataStore/db");

db.serialize(function () {
  const salt = crypto.randomBytes(16);
  db.run(
    "INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
    ["alice", crypto.pbkdf2Sync("letmein", salt, 310000, 32, "sha256"), salt]
  );
});

module.exports = db;
