const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
require("dotenv").config();

router.post("/create-order", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // paise mein
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).send("Error creating order");
  }
});

module.exports = router;
