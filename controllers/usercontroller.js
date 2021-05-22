//1. wrong var router = Router();
var router = require("express").Router();
//2. wrong var bcrypt = require("bcrypt");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var User = require("../db").sequelize.import("../models/user"); //wrong not sequelize

router.post("/signup", (req, res) => {
  User.create({
    full_name: req.body.user.full_name,
    username: req.body.user.username,
    passwordHash: bcrypt.hashSync(req.body.user.password, 10), //passwordhash naming
    email: req.body.user.email,
  }).then(
    function signupSuccess(user) {
      let token = jwt.sign({ id: user.id }, "lets_play_sum_games_man", {
        expiresIn: 60 * 60 * 24,
      });
      res.status(200).json({
        user: user,
        token: token,
      });
    },

    function signupFail(err) {
      res.status(500).send(err.message);
    }
  );
});

router.post("/signin", (req, res) => {
  User.findOne({ where: { username: req.body.user.username } }).then((user) => {
    if (user) {
      bcrypt.compare(
        req.body.user.password,
        user.passwordHash,
        function (err, matches) {
          if (matches) {
            var token = jwt.sign({ id: user.id }, "lets_play_sum_games_man", {
              expiresIn: 60 * 60 * 24,
            });
            res.json({
              user: user,
              message: "Successfully authenticated.",
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: "Passwords do not match." });
          }
        }
      );
    } else {
      res.status(403).send({ error: "User not found." });
    }
  });
});

module.exports = router;
