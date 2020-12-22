const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  mobileNumber: { type: String, required: true },
  items: { type: Array },
  total: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model("billing", billingSchema);
