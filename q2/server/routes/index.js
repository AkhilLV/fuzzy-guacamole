const express = require("express");
const db = require("../db");

const router = express.Router();

function convertDateFormat(dateString) {
  // Split the input date string into components
  const [year, month, day] = dateString.split("-");
  // Return the date in DD-MM-YYYY format
  return `${day}-${month}-${year}`;
}

router.get("/", function (req, res, next) {
  console.log(req.query);
  const { age, gender, start, end } = req.query;

  let query =
    "SELECT sum(A) / 60 as A, sum(B) / 60 as B, sum(C) / 60 as C, sum(D) / 60 as D, sum(E) / 60 as E, sum(F) / 60 as F FROM new_dataset WHERE 1=1";
  const params = [];

  if (age) {
    query += " AND age = ?";
    params.push(age);
  }
  if (gender) {
    query += " AND gender = ?";
    params.push(gender);
  }
  if (start && end) {
    query += " AND day BETWEEN ? AND ?";
    params.push(start, end);
  } else if (start) {
    query += " AND day >= ?";
    params.push(start);
  } else if (end) {
    query += " AND day <= ?";
    params.push(end);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ count: rows.length, data: rows });
  });
});

router.post("/time-trend", (req, res) => {
  const { age, gender, start, end } = req.query;
  const { feature } = req.body;

  if (!feature || !start || !end) {
    return res.status(400).json({
      error: "Missing required query parameters (feature, start, end)",
    });
  }

  let sql = `
    SELECT 
      day, 
      SUM(${feature}) AS total_feature_value
    FROM new_dataset
    WHERE
      day BETWEEN ? AND ?
  `;

  if (age) {
    sql += " AND age = ?";
  }
  if (gender) {
    sql += " AND gender = ?";
  }

  sql += " GROUP BY day ORDER BY day ASC;";

  const params = [start, end];
  if (age) params.push(age);
  if (gender) params.push(gender);

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json({ data: rows });
  });
});

module.exports = router;
