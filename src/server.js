const path = require("path");
const dotenv = require("dotenv");
const app = require("./app");

const http = require('http');
const { Server } = require('socket.io');

const envPath = path.resolve(__dirname, "config", ".env.local");
dotenv.config({ path: envPath });

const ip = process.env.SERVER_IP;
const port = parseInt(process.env.SERVER_PORT);


// Create HTTP server
const server = http.createServer(app);

// Create Socket.io instance and attach it to the server with CORS settings
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//  PROBLEMA : SE CREAZA UN SOCKET NOU LA FIECARE REFRESH DE PAGINA

io.on('connection', (socket) => {
    console.log('A user connected')

    // Handle socket events
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, ip, () => {
    console.log(`Server is listening at http://${ip}:${port}`);
});
