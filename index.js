require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var axios = require("axios").default;
const Agenda = require("agenda");

const mongoConnectionString = process.env.MONGODB_URL;

const agenda = new Agenda({ db: { address: mongoConnectionString } });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var router = express.Router();

agenda.define("HTTP Request", async (job) => {
  const { name, request, expect } = job.attrs.data;
  console.log(job.attrs.data);
  const data = await runCheck(request, expect);
  if (!data.result) {
    await job.fail(data.body);
  }
});

router.post("/job", async function (req, res) {
  const { name, request, expect, frequency } = req.body;
  console.log(name, request, expect, frequency);

  //The uuid is a string containing request type and url because that's unique
  //const uuid = request.method + "-" + request.url;
  await agenda
    .create(`HTTP Request`, req.body)
    .unique({ method: request.method, url: request.url })
    .repeatEvery(`${frequency} seconds`)
    .save();
  res.sendStatus(200);
});

const runCheck = async (request, expect) => {
  const { status, data } = await axios(request);
  console.log(status);
  if (status == expect) {
    return { result: true, data: data };
  } else {
    return { result: false, data: data };
  }
};

(async function () {
  await agenda.start();
})();

app.use("/api", router);
app.listen(port);
console.log("Server started at port: " + port);
