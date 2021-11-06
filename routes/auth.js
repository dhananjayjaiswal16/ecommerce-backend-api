const router = require('express').Router();
const User = require('../models/User');

const { check, validationResult } = require('express-validator');

const CryptoJS = require('crypto-js');

router.post('/register',
    [
        check('username', 'Please add your Name').not().isEmpty(),
        check('email', 'Please add a valid email ID').isEmail(),
        check('password', 'Please add your password with 5 or more characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;

        try {
            var user = await User.findOne({ email });


            if (user) {
                return res.json({ msg: 'User already exists' });
            }

            user = new User({
                username,
                email,
                password: CryptoJS.AES.encrypt(
                    password,
                    process.env.PASS_SEC
                ).toString(),
            });

            await user.save();
            res.json({ user });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

module.exports = router;