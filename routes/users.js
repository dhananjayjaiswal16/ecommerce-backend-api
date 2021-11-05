const router = require('express').Router();

router.get('/usertest', (req, res) => {
    res.send('user test -> 1');
})

router.post('/user-post-test', (req, res) => {
    const username = req.body.username;
    console.log(username);

    res.json(username);
})


module.exports = router;