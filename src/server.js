const path = require("path");
const dotenv = require("dotenv");
const app = require("./app");

const envPath = path.resolve(__dirname, "config", ".env.local");
dotenv.config({ path: envPath });

const ip = process.env.SERVER_IP;
const port = parseInt(process.env.SERVER_PORT);

app.listen(port, ip, () => {
    console.log(`Server is listening at http://${ip}:${port}`);
});
