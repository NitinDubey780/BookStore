const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length is more than 3
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: "Username length should be greater than 3" });
        }

        const existingUsername = await user.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already Exists" });
        }
        const existingEmail = await user.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already Exists" });
        }
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password's length should be greater than 5" });
        }

        // Note: Store password in plain text (not recommended for production)
        const newUser = new user({
            username: username,
            email: email,
            password: password,  // Store password as plain text (not secure)
            address: address,
        });
        await newUser.save();
        return res.status(200).json({ message: "Sign up Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password matches (simple comparison, not secure)
        if (existingUser.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const authClaims = [
            { name: existingUser.username },
            { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, "bookStore123", {
            expiresIn: "30d",
        });
        res.status(200).json({ id: existingUser.id, role: existingUser.role, token: token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await user.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await user.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/count', async (req, res) => {
    try {
      const userCount = await user.countDocuments({ role: "user" });
      res.json({ count: userCount });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
