const express = require("express");
const Review = require("../models/reviews");
const router = express.Router();

// POST route
router.post("/reviews", async (req, res) => {
  const { bookId, userId, rating, comment } = req.body;
  const review = new Review({ bookId, userId, rating, comment });
  await review.save();
  res.status(201).json({ message: "Review saved" });
});

// GET route
router.get("/:bookId", async (req, res) => {
  const reviews = await Review.find({ bookId: req.params.bookId }).populate("userId", "name");
  res.json(reviews);
});

module.exports = router;
