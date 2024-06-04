const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration');
const jwtSecret = jwtSecretHandler.jwtSecret;
const jwtBlackListHandler = require('./tokenBlackList')
//Se va utiliza in toate requesturile ce vor necesita actiuni de dupa logare.
//pasarea acestei functii in routere va forta orice request la acel endpoint sa foloseasca un JWT.
//de facut in alt tiket verificarea de roluri.
//Un endpoint va fi specific pt admin,altul pentru client obisnuit.
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];


    if (!token) return res.status(401).json({ error: 'Unauthorized: Access token is missing' });
    const decodedToken = jwt.decode(token);
    const username = decodedToken.user;
    jwt.verify(token, jwtSecret, (err, user) => {
        if (jwtBlackListHandler.isTokenBlacklisted(username)) {
            return res.status(403).json({ error: 'Forbidden: Invalid access token' });
        }
        if (err) {
            if (err.name === 'JsonWebTokenError' ) {
                console.log(err);
                return res.status(403).json({ error: 'Forbidden: Invalid access token' });
            }
            return next(err); // Pass other errors to the global error handler
        }
        req.user = user;

        next();
    });
}

module.exports = authenticateToken;