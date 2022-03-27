const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productname: { type: String, required: true },
    whenToOrder: { type: Date, required: true },
    isOrdered: { type: Boolean, required: false, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
