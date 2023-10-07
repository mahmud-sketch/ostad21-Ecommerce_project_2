const express = require("express");
const router = require("./src/route/api");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// Security Middleware
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

//Database
const mongoose = require("mongoose");
app.use(express.static("client/build"));

// Security Middleware Implementation
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(xss());

//Body-Parser
app.use(bodyParser.json());

//Rate  Limit Middleware
const Limiter = rateLimit({ windowMs: 15 * 60 * 100, max: 3000 });
app.use(Limiter);

// Mongo DB connection
let DB_URI =
  "mongodb+srv://user:pass@cluster0.jg88znx.mongodb.net/sales?retryWrites=true&w=majority";
let OPTION = {
  user: "testuser",
  pass: "GdP9O5hqmWh3xqdZ",
  autoIndex: true,
};
mongoose
  .connect(DB_URI, OPTION)
  .then(console.log("connection successfull now"))
  .catch((err) => console.log("new" + err));

mongoose.connection.on("error", (err) => {
  console.log(err);
});

//Managing Backend Routing
app.use("/api/v1/", router);

module.exports = app;
