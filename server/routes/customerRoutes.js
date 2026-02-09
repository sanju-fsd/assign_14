const express = require("express");
const Customer = require("../models/Customer");
const auth = require("../middleware/authMiddleware");

const router = express.Router();


//  CREATE customer
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      createdBy: req.user.id
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Failed to create customer" });
  }
});


//  READ customers 
router.get("/", auth, async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});


//  UPDATE customer
router.put("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Failed to update customer" });
  }
});


//  DELETE customer
router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete customer" });
  }
});

module.exports = router;
