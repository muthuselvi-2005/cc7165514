require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  });

app.get("/", (req, res) => {
  res.send("API is running!");
});


app.get("/api/transactions", async (req, res) => {
  const transactions= await Transaction.find();
  res.json(transactions);
});


app.get("/api/transactions/:id", async (req, res) => {
  const transaction= await Transaction.findById(req.params.id);
  if(transaction) res.json(transaction);
  else res.status(404).json({ message: "Transaction not found" });
});


app.post("/api/transactions", async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
});


app.put("/api/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Transaction updated successfully" });
});


app.delete("/api/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Transaction deleted successfully" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});