require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoString = process.env.MONGODB_URI;
const cookieParser = require("cookie-parser");


mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

require("./models/Cinema");
require("./models/Movie");
require("./models/Order");
require("./models/ScheduledScreening");
require("./models/Screening");
require("./models/SeatType");
require("./models/Ticket");
require("./models/User");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    methods: ["POST", "PUT", "PATCH", "DELETE", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
// app.use(bodyParser.raw({type: "*/*"}));
// app.use(bodyParser.json());
// app.use(express.raw({type: 'application/json'}));
// app.use(bodyParser.text({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// only use the raw bodyParser for webhooks
app.use((req, res, next) => {
  if (req.originalUrl === "/payment/webhook") next();
  else bodyParser.json()(req, res, next);
});

// ROUTES
app.use("/payment", require("./routes/Payment"));

app.get("/", (req, res) => {
  console.log("GET /");
  res.send("HELLO FROM BACKEND");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
