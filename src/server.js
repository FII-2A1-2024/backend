const path = require("node:path");
const path = require("node:path");
const dotenv = require("dotenv");
const app = require("./app");
const Socket = require("./utils/SocketIO");
const http = require("node:http");

const envPath = path.resolve(__dirname, "config", ".env.local");
dotenv.config({ path: envPath });

const ip = process.env.SERVER_IP;
const port = Number.parseInt(process.env.SERVER_PORT);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = Socket.initializeSocket(server);

server.listen(port, ip, () => {
	console.log(`Server is listening at http://${ip}:${port}`);
});
