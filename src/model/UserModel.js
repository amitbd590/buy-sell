const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const DataSchema = new mongoose.Schema(
  {
    email: { type: String, require: true, index: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    userRoles: { type: String, default: "User" },
    age: { type: String },
    mobile: { type: String },
    gender: { type: String },
    password: { type: String },
    image: { type: String },
    createDate: { type: Date, default: Date.now() },
    location: { type: String },
  },
  { versionKey: false }
);

DataSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("users", DataSchema);
module.exports = UserModel;
