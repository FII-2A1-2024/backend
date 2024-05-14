const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration')

//functie ce genereaza un token dupa ce user-ul se logheaza
//de completat cu roluri:
//poate fi admin sau client obisnuit.
function generateAccessToken(user) {
  return jwt.sign({ user, timestamp: Date.now(), expiresIn: '24h' }, jwtSecretHandler.jwtSecret);
}

//functie ce genereaza token de validare a contului
function generateVerificationToken(email) {
  return jwt.sign({
    email: email,
    timestamp: Date.now()
  }, jwtSecretHandler.jwtSecret, { expiresIn: '24h' })
}

function generateResetToken(email) {
  return jwt.sign(
    {
      email: email,
      timestamp: Date.now(),
    },
    jwtSecretHandler.jwtSecret,
    { expiresIn: "5min" },
  );
}

module.exports = {
  generateAccessToken,
  generateVerificationToken,
  generateResetToken
} 