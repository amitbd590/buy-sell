const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const DataSchema = new mongoose.Schema(
  {
    email: { type: String, require: true, index: true, unique: true },
    userRoll: { type: String },
    password: { type: String },
    image: { type: String },
    createDate: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

DataSchema.plugin(uniqueValidator);

const AdminModel = mongoose.model("admins", DataSchema);
module.exports = AdminModel;
