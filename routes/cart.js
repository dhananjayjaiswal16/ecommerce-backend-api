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


//UPDATE
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = Cart.findById(req.params.id);

        if (!cart) {
            res.status(404).json({ msg: 'Cart not found' });
        }

        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while updating cart' })
    }
})

//GET single cart

router.get('/find/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error while fetching single user's cart");
    }

})

//GET all carts

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;