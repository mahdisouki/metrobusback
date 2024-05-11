const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        console.log(req.header("Authorization"))
        const token = req.header("Authorization").split(" ")[1];
        if (!token) return res.status(400).json({ msg: 'Invalid Authentication' });

        jwt.verify(token, "metrobus123", (error, user) => {
            if (error) return res.status(400).json({ msg: error });
            req.user = user;
            next();
        });

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = auth