const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: "Authentication required !!" });
    }


    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({ msg: "Invalid Token while verifying" });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.json({ msg: "Invalid Token" });
    }
}

const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ msg: "You are not authorised" });
        }
    })

}

module.exports = {
    verifyToken,
    verifyTokenAndAuth
}