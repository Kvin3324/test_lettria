const express = require("express");
const router = express.Router();
const loginController = require("../db/controllers/login");

router.use(express.json());

router.use(function checkBody(req, res, next) {
  if (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.mail) === false) {
    return res.status(401).json({
      error: true,
      serverMessage: "Wrong format mail"
    })
  }

  if (req.body.password.length < 6) {
    return res.status(401).json({
      error: true,
      serverMessage: "Password needs to be at least 6 characters."
    })
  }

  next();
})

router.post("/", function (req, res) {
  loginController(req.body).then(response => res.status(response.code).json(response.forClient));
})

module.exports = router;