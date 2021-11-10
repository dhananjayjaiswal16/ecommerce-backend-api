const router = require('express').Router();
const User = require('../models/User');

const { check, validationResult } = require('express-validator');

const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


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
                    process.env.PASSWORD_SECRET
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



//LOGIN USER
router.post('/login',
    [
        check('username', 'Please add a valid username').exists(),
        check('password', 'Please enter a password').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            var user = await User.findOne({ username });

            if (!user) {
                return res.status(401).json({ msg: "User not found" });
            }
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASSWORD_SECRET
            );

            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

            if (password !== originalPassword) {
                return res.status(401).json({ msg: "Invalid email or password" });
            }


            const payload = {
                id: user._id,
                isAdmin: user.isAdmin
            }

            jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3d',
            }, (err, token) => {
                if (err) throw err;

                res.json({ user, token });
            });






        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");//500=server failure 
        }

    }
)

module.exports = router;