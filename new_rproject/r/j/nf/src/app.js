const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid')
const app = express();
var cors = require('cors');
app.use(cors());
// body-parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Nodejs SetUp" });
});
app.use("/api", require("./app/router/index"));
app.use("/uploads", express.static(__dirname + "/uploads/"));
module.exports = app;