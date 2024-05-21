const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration')
//functie ce genereaza un token dupa ce user-ul se logheaza
//de completat cu roluri:
//poate fi admin sau client obisnuit.
function generateAccessToken(user) {
  return jwt.sign({ user, timestamp: Date.now() }, process.env.JWT_ACCESS_KEY,{expiresIn : "10s"});
}
function generateRefreshToken(user) {
  return jwt.sign({ user }, process.env.JWT_REFRESH_KEY, { expiresIn: '20s' });
}
function refreshAccessToken(refreshToken,req,res,next) {
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    console.log("Verification successful");

    const newAccessToken =  generateAccessToken(user);
    console.log(newAccessToken);

    req.user = jwt.decode(newAccessToken);
    console.log(req.user);
   // req.cookies.accessToken = newAccessToken;
      
    next();
  });
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
  generateResetToken,
  generateRefreshToken,
  refreshAccessToken
} 