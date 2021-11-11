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

//GET all products
router.get('/', async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    let products;
    try {
        if (queryNew) {
            products = await Product.find().sort({ _id: -1 }).limit(1)
        } else if (queryCategory) {
            products = await Product.find({
                categories: {
                    $in: [queryCategory]
                }
            })
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while getting all users' });
    }
})


//DELETE product 

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ msg: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Product deleted' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while deleting user" })
    }
})


//UPDATE product
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ msg: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json(updatedProduct);
    } catch (error) {

    }
})




module.exports = router;