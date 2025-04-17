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
app.use(cors());
app.use(express.json());


//routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1/", Favourite);
app.use("/api/v1/", Cart);
app.use("/api/v1/", Order);
app.use("/api/payment", paymentRoutes);
//creating port
app.listen(process.env.PORT, () =>{
    console.log(`Server Started at port ${process.env.PORT}`);
});