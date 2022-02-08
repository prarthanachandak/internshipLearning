//models - structure to define schema

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
    unique: true
  },
  first_name: {
    type: String,
    default: null
  },
  last_name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  token: {
    type: String
  },
  role: {
      type: Number,
      default: 0
  }
  
});

module.exports = mongoose.model("user", userSchema);