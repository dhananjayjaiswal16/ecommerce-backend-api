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

//DELETE
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = Cart.findById(req.params.id);

        if (!cart) {
            res.status(404).json({ msg: 'Cart not found' });
        }

        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Cart deleted' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while deleting cart" })
    }
})



module.exports = router;