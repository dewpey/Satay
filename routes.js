const Agenda = require("agenda");
const express = require("express");

const mongoConnectionString = process.env.MONGODB_URL;
const agenda = new Agenda({ db: { address: mongoConnectionString } });
const router = express.Router();

router.post("/job", async function (req, res, next) {
  const { name, request, expect, frequency } = req.body;
  console.log(name, request, expect, frequency);
  try {
    await agenda
      .create(`HTTP Request`, req.body)
      .unique(
        { method: request.method, url: request.url },
        { insertOnly: true }
      )
      .repeatEvery(`${frequency} seconds`)
      .save();
    res.sendStatus(200);
  } catch {
    next(error);
  }
});

module.exports = router;
