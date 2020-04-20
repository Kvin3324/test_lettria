const express = require("express");
const router = express.Router()
const { GET, POST} = require("../db/controllers/home");
const { MongoClient } = require("mongodb")

router.use(express.json());

router.use(function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({
      error: true,
      serverMessage: "No authorization approved."
    })
  }

  MongoClient.connect(process.env.DB_URL, {useUnifiedTopology: true}).then(client => {
    client.db().collection("Users").findOne({token: req.headers.authorization})
      .then(document => {
        if (!document) {
          client.close();
          return res.status(401).json({
            error: true,
            serverMessage: "Unauthorized connection.",
          })
        }
        res.locals = document;
          client.close();
        next();
      })
  })
})

router.get("/", function(req, res) {
  GET(res.locals).then(response => res.status(response.code).json(response.forClient));
})

router.post("/", function(req, res) {
  if (Object.keys(req.body).length === 0 ) {
    return res.status(422).json({
      error: true,
      serverMessage: "Missing parameters"
    })
  }

  if (!req.body.inputContent) {
    return res.status(403).json({
      error: true,
      serverMessage: "Missing property."
    })
  }

  if (!Array.isArray(req.body.inputContent)) {
    return res.status(403).json({
      error: true,
      serverMessage: "Bad value for inputContent."
    })
  }

  if (req.body.inputContent.length === 0) {
    return res.status(403).json({
      error: true,
      serverMessage: "Empty array."
    })
  }

  POST(res.locals, req.body.inputContent).then(response => res.status(response.code).json(response.forClient));
})

module.exports = router;