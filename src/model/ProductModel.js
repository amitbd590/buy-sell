const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const DataSchema = new mongoose.Schema(
  {
    email: { type: String },
    Districts: { type: String },
    Category: { type: String },
    SubDistricts: { type: String },
    condition: { type: String },
    productName: { type: String },
    Authenticity: { type: String },
    Brand: { type: String },
    Model: { type: String },
    Edition: { type: String },
    Feature: { type: String },
    Description: { type: String },
    Price: { type: String },
    Negotiable: { type: String },
    Photo: [
      {
        original: { type: String },
        _id: false,
        thumbnail: { type: String },
        _id: false,
      },
    ],
    ClientName: { type: String },
    mobileNumber: { type: String },
    Approve: { type: Boolean },
    createDate: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

DataSchema.plugin(uniqueValidator);
const ProductModel = mongoose.model("products", DataSchema);

module.exports = ProductModel;
