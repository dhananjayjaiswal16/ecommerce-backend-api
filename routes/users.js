const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('../middleware/verifyToken');

//Update user

router.put('/:id', verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {

    console.error(error);
    res.status(500).json({ msg: "Server error while updating user" });
  }
})


//Delete User
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error while deleting user' });
  }
})

//GET users 
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const user = query ?
      await User.find().sort({ _id: -1 }).limit(5)
      :
      await User.find();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error while getting all users' });
  }
})


//GET single user
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error while getting user' });
  }
})


// GET user stats
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while aggregating orders" });
  }
})


module.exports = router;