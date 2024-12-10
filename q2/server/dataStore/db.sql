.import csv_data.csv dataset --csv

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    hashed_password BLOB,
    salt BLOB
);

CREATE TABLE IF NOT EXISTS "new_dataset" (
    "Day" DATE,
    "Age" TEXT,
    "Gender" TEXT,
    "A" INT,
    "B" INT,
    "C" INT,
    "D" INT,
    "E" INT,
    "F" INT
);