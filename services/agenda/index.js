require("dotenv").config();
const Agenda = require("agenda");
const axios = require("../axios");
const mongoose = request("../mongoose");
console.log(process.env);
const mongoConnectionString = process.env.MONGODB_URL;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("HTTP Request", async (job) => {
  const { name, request, expect } = job.attrs.data;
  console.log("Running ", name, request, expect);
  const data = await axios.runCheck(request, expect);
  const uuid = request.method + "-" + request.url;
  if (!data.result) {
    //it failed
    await mongoose.update(true, uuid);
    await job.fail(data.body);
  } else {
    await mongoose.update(false, uuid);
  }
});

(async function () {
  await agenda.start();
})();
