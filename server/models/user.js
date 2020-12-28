const mongoose = require("mongoose");
const Application = require("../models/application");

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  applications: {
    type: Array,
    applications: [Application],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
