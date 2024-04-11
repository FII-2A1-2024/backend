// authMiddleware.js
const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration');
const jwtSecret = jwtSecretHandler.jwtSecret;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: Access token is missing' });

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ error: 'Forbidden: Invalid access token' });
            }
            return next(err); // Pass other errors to the global error handler
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
