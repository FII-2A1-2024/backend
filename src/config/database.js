const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, ".env.local");
dotenv.config({ path: envPath });

const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT);
const database = process.env.DB_DATABASE;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const db = mysql.createConnection({
    host: host,
    port: port,
    database: database,
    user: user,
    password: password,
});
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to " + database + " database");
});

module.exports = db;
