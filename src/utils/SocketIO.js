const { Server } = require("socket.io");
const { deleteUserFromLoggedTable } = require('../services/userServices');
const authenticateToken = require('../utils/JWT/JWTAuthentication');

let io = null;

class Socket {
    static initializeSocket(server) {
        io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            socket.on("removeLoggedUser", async (data) => {
                const { socketId, token } = data;

                // Mock Express request and response objects
                const req = {
                    headers: { authorization: `Bearer ${token}` }
                };
                const res = {
                    status: function (statusCode) {
                        this.statusCode = statusCode;
                        return this;
                    },
                    json: function (result) {
                        console.log(result);
                        this.result = result;
                        return this;
                    },
                    send: function (result) {
                        console.log(result);
                        this.result = result;
                        return this;
                    }
                };

                // Use a promise to handle the middleware invocation
                const authenticate = new Promise((resolve, reject) => {
                    authenticateToken(req, res, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(req.user);
                        }
                    });
                });

                try {
                    await authenticate;
                    await deleteUserFromLoggedTable(socketId);
                    console.log(`User with socket ID ${socketId} removed`);
                } catch (err) {
                    console.log(`Authentication error: ${err.message || err}`);
                }
            });

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });

        return io;
    }

    static getSocket() {
        return io;
    }
}

module.exports = Socket;