const Cart = require('../models/Cart');

const router = require('express').Router();
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('../middleware/verifyToken');

//CREATE 
router.post('/', verifyToken, async (req, res) => {
    try {
        const newCart = new Cart(req.body);

        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server while adding Cart' });
    }
})



module.exports = router;