const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//Add Book
router.post("/add-book", authenticateToken, async (req, res) => {
    try{
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin")
{
    return res.status(400).json({ message: "You are not having access to perform admin work"})
}
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            prize: req.body.prize,
            desc: req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({ message: "Product added Successfully"})
    } catch(error) {
        res.status(500).json({ message: "Internal Server error"});
    }
});

//Update book
router.put("/update-book", authenticateToken, async (req, res) => {
    try{
        const {bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            prize: req.body.prize,
            desc: req.body.desc,
            language: req.body.language,
        });
        return res.status(200).json({ message: "Product Upadated Successfully"});
    } catch(error) {
        res.status(500).json({ message: "An error occured"});
    }
});

//Delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try{
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: "An Error occurred"});
    }
});

// get all books
router.get("/get-all-books", async (req, res) => {
    try{
        const books = await Book.find().sort({ createdAt: -1});
        return res.json({
            status:"success",
            data: books,
        });
    } catch (error) {
        return res.status(500).json({ message: "an error occured"});
        }
});

// get recent books
router.get("/get-recent-books", async (req, res) => {
    try{
        const books = await Book.find().sort({ createdAt: -1}).limit(4);
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        return res.staus(500).json({ message: "An error occured"});
    }
});

//get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "Success",
            data: book,
        });
    } catch (error) {
        return res.status(500).json({ message: "An error occured"});
    }
});
// Get books by category
router.get("/category/:category", async (req, res) => {
    try {
      const books = await Book.find({ category: req.params.category });
      res.status(200).json({ books });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books by category" });
    }
  });
  // Search books by title
router.get("/search", async (req, res) => {
    try {
      const query = req.query.q;
      const books = await Book.find({
        title: { $regex: query, $options: "i" },
      });
      res.status(200).json({ books });
    } catch (err) {
      res.status(500).json({ error: "Search failed" });
    }
  });
router.get('/count', async (req, res) => {
    try {
      const bookCount = await Book.countDocuments();
      res.json({ count: bookCount });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
module.exports = router;