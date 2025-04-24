const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const  newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();
            //saving order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id},
            });
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id},
            });
        }
        return res.json({
            status: "success",
            message: "Order Placed Successfully",
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"});
    }
});

//get order history of particular user
router.get("/get-order-history", authenticateToken, async (req,res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        const ordersData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data: ordersData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"});
    }
});

// get all order
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
        .populate({
            path: "book",
        })
        .populate({
            path: "user",
        })
        .sort({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error Occurred"})
    }
});

// update order --admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: req.body.status });
        return res.json({
            status: "Success",
            message: "Status updated Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});
router.get("/count", async (req, res) => {
    try {
      const count = await Order.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order count" });
    }
  });
// route: GET /api/orders/stats
router.get('/stats', async (req, res) => {
    try {
      const orderCount = await Order.countDocuments();
      const totalIncome = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      res.json({
        count: orderCount,
        income: totalIncome[0]?.total || 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
router.get('/recent', async (req, res) => {
    try {
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5);
      res.json(recentOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.get("/daily-logins", async (req, res) => {
    try {
      const logins = await Login.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      res.json(logins);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });



  router.get("/download-invoice/:id", async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("book").populate("user");
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      const doc = new PDFDocument();
      const filePath = `invoices/invoice-${order._id}.pdf`;
      doc.pipe(fs.createWriteStream(filePath));
  
      doc.fontSize(25).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.text(`Customer: ${order.user.name}`);
      doc.text(`Book: ${order.book.title}`);
      doc.text(`Price: ₹ ${order.book.prize}`);
      doc.text(`Status: ${order.status}`);
      doc.end();
  
      doc.on("finish", () => {
        res.download(filePath);
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  });
  
  
module.exports = router;