const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default:"https://th.bing.com/th/id/OIP.05klMBqlZHF4jdQwgx001gAAAA?w=400&h=400&rs=1&pid=ImgDetMain"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favourites: [{ type: mongoose.Types.ObjectId,
        ref: "books",
    },
],
cart: [
    {
        type: mongoose.Types.ObjectId,
        ref: "books",
},
],
orders: [{
    type: mongoose.Types.ObjectId,
    ref: "order",
},
],
},
{timestamps: true}
);
module.exports = mongoose.model("user", user);