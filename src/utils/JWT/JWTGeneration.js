const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration')

//functie ce genereaza un token dupa ce user-ul se logheaza
function generateAccessToken(user) {
    const token = jwt.sign(user, jwtSecretHandler.jwtSecret, { expiresIn: '15m' });
  return token
}

module.exports = generateAccessToken;