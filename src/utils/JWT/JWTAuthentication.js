
const jwt = require('jsonwebtoken');
const generateAccessTokenHandler = require('./JWTGeneration');
const UserService = require("../../services/userServices")
const httpCodes = require("../../config/returnCodes")
async function authenticateToken(req, res, next) {
    const cookieAccessToken = req.cookies.accessToken;
    if (!cookieAccessToken) return res.status(401).json({ error: 'Unauthorized: Access token is missing' });
    let newAccessToken = req.cookies.accessToken;
    const decodedToken = jwt.decode(cookieAccessToken);
    const username = decodedToken.user;
       jwt.verify(cookieAccessToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                console.log(err);
                return res.status(403).json({ error: 'Forbidden: Invalid access token' });
            }
            if (err.name === 'TokenExpiredError') {
                try {                
                    console.log("Verification successful,token refreshed,sending updated cookies to the client...");
                    const cookieRefreshToken = req.cookies.refreshToken;
                    const refreshToken = jwt.verify(cookieRefreshToken, process.env.JWT_REFRESH_KEY);
                    if (refreshToken) {
                        newAccessToken = generateAccessTokenHandler.generateAccessToken(username);
                        const newDecodedToken = jwt.decode(newAccessToken)
                        const newPayload = newDecodedToken;
                        req.user = newPayload;
                        console.log(req.user);
                        const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;

                        res.status(200)
                            .cookie('accessToken', newAccessToken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: 'Strict',
                                maxAge: oneYearInMilliseconds
                            });
                        next();
                    } else {
                        return res.status(403).json({ message: "refresh token error" });
                    }
                    
                } catch (err) {
                    console.log(err);
                    //de mutat logica de la refresh token pt stergerea userului delogat aici.
                    return res.status(403).json({ error: 'Forbidden: Could not refresh token' });
                }
            } else {
                console.log(err);
                return res.status(403).json({ error: 'Forbidden: Invalid access token' });
            }
        } else {
            req.user = user;
            console.log(req.user)
            next();
        }
       });
}

  async function refreshTokenCheck(req, res, next) {
    const cookieRefreshToken = req.cookies.refreshToken;
    if (!cookieRefreshToken) return res.status(401).json({ error: 'Unauthorized: Refresh token is missing' });
    const decodedToken = jwt.decode(cookieRefreshToken);
    const username = decodedToken.user
    jwt.verify(cookieRefreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                console.log(err);
                return res.status(403).json({ error: 'Forbidden: Invalid refresh token' });
            }

            if (err.name === 'TokenExpiredError') {
                console.log(err);
                const result = await UserService.getIdByEmail(username);
                if (result.resCode != httpCodes.USER_DOESNOT_EXIST) {
                    const uid = result.uid;
                    await UserService.deleteLoggedOutUser(uid)
                }
             
                return res.status(403).json({ error: 'Expired: refresh token expired' });
            }
        }
        else {  
            req.user = user;
            next();      
        }
    });
}

 async function isUserTimedOut(req, res, next) {
    const cookieAccessToken = req.cookies.accessToken;
    console.log(cookieAccessToken)
    const decodedToken = jwt.decode(cookieAccessToken);
    const username = decodedToken.user;
    console.log(username)
    const userFromTimedOutUsers = await UserService.getIdByEmail(username);
    const uid = userFromTimedOutUsers.uid;
    const timedOutUser = await UserService.getTimedOutUser(uid);
    if (timedOutUser) {
        const timeoutEnd = new Date(timedOutUser.timeout_start.getTime() + timedOutUser.timeout_duration * 60000);

        if (timeoutEnd > new Date()) {
            return res.status(403).json({ message: "You are currently timed out!" });
        }
        else {
          await UserService.deleteTimedOutUser(uid);
        }
    }
    next();
}

module.exports = {
    authenticateToken,
    refreshTokenCheck,
    isUserTimedOut
};
