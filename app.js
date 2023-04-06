const express = require("express");
const router = require("./src/router/api");
const app = new express();
const bodyParser = require("body-parser");
const multer = require("multer");

// Security Middleware

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Database

const mongoose = require("mongoose");

//Env
const dotENV = require("dotenv");
dotENV.config();

// Security Middleware Implement

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "100mb" }));

//BodyParser Implement
app.use(bodyParser.json());

// File Upload
app.use("/uploads", express.static("uploads"));

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
});

app.use(limiter);

const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@testportfolio.m5q5knp.mongodb.net/buy-sell?retryWrites=true&w=majority`;

mongoose.connect(
  URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    console.log(" Mongoose is connected");
    console.log(error);
  }
);

// Front End Tagging api
app.use("/api/v1", router);

module.exports = app;
