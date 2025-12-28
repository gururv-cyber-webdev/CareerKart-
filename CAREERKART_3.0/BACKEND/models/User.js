const { IdempotencyParameterMismatch } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "mentor", "admin"], required: true },
  name: { type: String, required: true },
  idProof: { type: String }, // for mentors
  status: { type: String, enum: ["pending", "approved"], default: "approved" } // mentors default pending
});

module.exports = mongoose.model("User", userSchema);