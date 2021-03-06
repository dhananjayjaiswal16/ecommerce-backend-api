const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.get('/payment', async (req, res) => {
    res.status(200).json({ msg: 'Got api/checkout' })
})

router.post('/payment', async (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "inr"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            console.error(stripeErr);
            res.status(500).json({ stripeErr, msg: 'Payment Error' });
        } else {
            res.status(200).json(stripeRes);
        }
    })
})

module.exports = router;