const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const SQLiteStore = require("connect-sqlite3")(session);

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./dataStore" }),
  })
);
app.use(passport.authenticate("session"));

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(403).json({ message: "Unauthorised access" });
};

app.use("/auth", authRouter);
app.use("/data", isAuthenticated, indexRouter);

app.listen(3000, () => {
  console.log("Listening on 3000");
});

module.exports = app;
