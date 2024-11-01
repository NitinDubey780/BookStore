const router = require("express").Router();
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
//sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        //check username length is more than 3
        if (username.length < 4) {
            return res
            .status(400)
            .json({message: "username length should be greater than 3"});
        }

        const existingusername = await user.findOne({username: username});
        if(existingusername) {
            return res.status(400).json({message: "Username already Exists"});
        }
        const existingemail = await user.findOne({email: email});
        if(existingemail) {
            return res.status(400).json({message: "Email already Exists"});
        }
        if (password.length <= 5) {
            return res.status(400).json({message: "Password's length should be greater than 5"});
        }
        const hashPass = await bcrypt.hash(password,5);

        const newuser = new user({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });
        await newuser.save();
        return res.status(200).json({message: "Sign up Successfully"});
    } catch (error) {
        res.status(500).json({ message: "internal server error"});
    }
});

// Sign in
router.post("/sign-in", async (req, res) => {
    try {
        const {username, password} = req.body;

        const existinguser = await user.findOne({ username });
        if (!existinguser) {
            res.status(400).json({ message: "Invalid credentials"});
        }

        await bcrypt.compare(password, existinguser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    {name: existinguser.username },
                    {role: existinguser.role },
                ]
                const token = jwt.sign({ authClaims },"bookStore123",{
                    expiresIn: "30d",
                })
                res.status(200).json({id: existinguser.id, role: existinguser.role, token:token});
            } else {
                res.status(400).json({message: "Invalid credentials"});
            }
        })
    } catch (error) {
        res.status(500).json({ message: "internal server error"});
    }
});
//get-user-information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try{
        const { id } = req.headers;
        const data = await user.findById(id).select('-password');
        return res.status(200).json(data);
    } catch(error) {
        res.status(500).json({ message: "internal server error"});
    }
});

//Update address
router.put("/update-address", authenticateToken, async (req, res) =>{
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await user.findByIdAndUpdate(id,{ address: address});
        return res.status(200).json({message: "Address updated Successfully"});
    } catch(error) {
        res.status(500).json({ message: "internal server error"});
    }
});
module.exports = router;