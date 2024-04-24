const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration')

//functie ce genereaza un token dupa ce user-ul se logheaza
//de completat cu roluri:
//poate fi admin sau client obisnuit.
function generateAccessToken(user) {
  const roles = ['admin', 'simpleUser'];
  
  // eroare 
  if (!roles.includes(user.role)) {
    const error = new Error('Unauthorized access');
    return error;
  }
  return jwt.sign({ user,timestamp: Date.now() }, jwtSecretHandler.jwtSecret);
}

//functie ce genereaza token de validare a contului
function generateVerificationToken(email) {
  return jwt.sign({
    email: email,
    timestamp: Date.now()
  }, jwtSecretHandler.jwtSecret, { expiresIn: '24h' })
}

module.exports = {
  generateAccessToken,
  generateVerificationToken,
} 