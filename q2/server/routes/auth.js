const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const db = require("../db");

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      function (err, row) {
        if (err) {
          return cb(err);
        }
        if (!row) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        crypto.pbkdf2(
          password,
          row.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return cb(err);
            }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
              return cb(null, false, {
                message: "Incorrect username or password.",
              });
            }
            return cb(null, row);
          }
        );
      }
    );
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred during login.", success: false });
    }
    if (!user) {
      return res.status(401).json({
        message: info.message || "Invalid credentials.",
        success: false,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "An error occurred during login.", success: false });
      }
      return res.json({
        message: "Login successful!",
        userId: user.id,
        username: user.username,
        success: true,
      });
    });
  })(req, res, next);
});

router.get("/logout", function (req, res, next) {
  console.log("reached logout");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({
      message: "Logged out",
      success: true,
    });
  });
});

router.post("/signup", function (req, res, next) {
  const salt = crypto.randomBytes(16);

  console.log(req.body.username);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        console.log("Errored out here");
        return next(err);
      }
      db.run(
        "INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
        [req.body.username, hashedPassword, salt],
        function (err) {
          if (err) {
            return next(err);
          }
          const user = {
            id: this.lastID,
            username: req.body.username,
          };
          req.login(user, function (err) {
            if (err) {
              return next(err);
            }

            res.json({
              message: "Signed up and Logged In",
              userId: req.user.id,
              username: req.user.username,
              success: true,
            });
          });
        }
      );
    }
  );
});

router.get("/check", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.json({
      message: "Login successful!",
      userId: req.user.id,
      username: req.user.username,
      success: true,
    });
  } else {
    res.json({
      message: "Not authenticated",
      success: false,
    });
  }
});

module.exports = router;
