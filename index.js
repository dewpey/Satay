require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");
//const runner = require("./services/agenda");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

app.use((err, _req, res, _next) => {
  logger.error(err);
  return res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
  });
});

const port = process.env.PORT || 8080;
const HOST = "0.0.0.0";
app.listen(port, HOST);
console.log("Server started at port: " + port);
