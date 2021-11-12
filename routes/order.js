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



module.exports = router;