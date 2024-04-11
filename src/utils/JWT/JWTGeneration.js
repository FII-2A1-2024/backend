const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration')

function generateAccessToken(user) {
    const token = jwt.sign(user, jwtSecretHandler.jwtSecret, { expiresIn: '15m' });
  return token
}

module.exports = generateAccessToken;