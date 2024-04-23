
const jwt = require('jsonwebtoken');
const jwtSecretHandler = require('./JWTSecretGeneration');
const jwtSecret = jwtSecretHandler.jwtSecret;
const authenticateToken = require('./JWTAuthentication');

// roluri
const roles = {
    ADMIN: 'admin',
    USER: 'user'
};

// Define a mock user object for testing purposes
const user = {
    id: 123456,
    username: 'user1',
    role: 'admin' 
};


const token = jwt.sign(user, jwtSecret);

console.log("Generated JWT token:", token);

const req = {
    headers: {
        'authorization': `Bearer ${token}`
    }
};

const res = {
    status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
    },
    json: function (data) {
        console.log(data);
    }
};


authenticateToken(req, res, () => {});
