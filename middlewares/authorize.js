const config = require('../config/index');
const jwt = require('jsonwebtoken');

// access token validation

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const accessToken = authHeader.split(' ')[1];
            if (accessToken) {
                const decoded = await jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
                if (decoded) {
                    req.decodedEmail = decoded.email;
                    req.decodedUserId = decoded.id;
                    req.decodedUsername = decoded.username;
                    req.decodedRole = decoded.role;
                }
                next();
            } else {
                res.status(401).json({ message: 'unauthorized access' });
            }
        } else {
            res.status(403).json({ message: 'forbidden access!!' });
        }
    } catch (err) {
        res.status(403).json({ message: err.message });
        next('authorization failed');
    }
};

module.exports = { verifyJWT };
