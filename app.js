const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");
const book = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const paymentRoutes = require("./routes/paymentRoutes");
const reviews = require("./routes/reviews")
app.use(cors());
app.use(express.json());


//routes
app.use("/api/user", user);
app.use("/api/book", book);
app.use("/api/favourite/", Favourite);
app.use("/api/cart/", Cart);
app.use("/api/order/", Order);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews/", reviews)
//creating port
app.listen(process.env.PORT, () =>{
    console.log(`Server Started at port ${process.env.PORT}`);
});