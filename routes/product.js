const router = require('express').Router();
const Product = require('../models/Product');

const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('../middleware/verifyToken');



//CREATE product
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const addedProduct = new Product(req.body);

        const savedProduct = await addedProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server while adding product' });
    }
})

//GET single product

router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error while fetching product");
    }

})

module.exports = router;