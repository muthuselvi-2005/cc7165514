const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    "type": String,
    "amount": Number,
    "category": String,
    "description":String,
    "date": {
      type: Date,
      default: Date.now 
    }
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);