const router = require('express').Router();
const Order = require('../models/Order');

const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('../middleware/verifyToken');



//CREATE order
router.post('/', verifyToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body);

        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server while adding Order' });
    }
})

//DELETE order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({ msg: 'Order not found' });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json("Order has been deleted...");
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error while delteing order' });
    }
});


//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({ msg: 'Order not found' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true }
        );

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while updating order' })
    }
});


//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });

        if (!orders) {
            res.status(404).json({ msg: 'Order not found' });
        }


        res.status(200).json(orders);
    } catch (err) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while getting user order' })
    }
});

module.exports = router;