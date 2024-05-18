const { Server } = require("socket.io");

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
            console.log("A user connected");

            // Handle socket events
            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });

        return io;
    }

    static getSocket(){
        return io;
    }
}

module.exports = Socket;