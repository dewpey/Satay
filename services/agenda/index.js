require("dotenv").config();
const Agenda = require("agenda");
const axios = require("../axios");
console.log(process.env);
const mongoConnectionString = process.env.MONGODB_URL;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("HTTP Request", async (job) => {
  const { name, request, expect } = job.attrs.data;
  console.log("Running ", name, request, expect);
  const data = await axios.runCheck(request, expect);
  if (!data.result) {
    await job.fail(data.body);
  }
});

(async function () {
  await agenda.start();
})();
