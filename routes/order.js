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

module.exports = router;