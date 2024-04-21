const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../config", ".env.local");
dotenv.config({ path: envPath });

console.log(process.env.DATABASE_URL);

//signupservice
//sendEmail
//prisma schema