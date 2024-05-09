const { S3Client, PutObjectCommand,  DeleteObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require("path");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');

const envPath = path.resolve(__dirname, "..", "config", ".env.local");
dotenv.config({ path: envPath });

const s3Client = new S3Client({ 
    region: process.env.REGION, 
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

async function uploadToS3(file) {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const uploadParams = {
        Bucket: process.env.BUCKET,
        Key: uniqueFileName,
        Body: fs.createReadStream(file.path),
    };

    const command = new PutObjectCommand(uploadParams);

    try {
        await s3Client.send(command);
        const fileUrl = `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/${uniqueFileName}`;
        return fileUrl;
    } catch (err) {
        throw new Error(`Error uploading file to S3 through AWS`);
    }
}

async function deleteFromS3(fileURL) {
    const parsedUrl = new URL(fileURL);
    const key = parsedUrl.pathname.split('/')[1];

    const deleteParams = {
        Bucket: process.env.BUCKET,
        Key: key
    };

    const command = new DeleteObjectCommand(deleteParams);

    try {
        await s3Client.send(command);
    } catch (err) {
        throw new Error(`Error deleting file from S3 through AWS`);
    }
}

module.exports = {
    uploadToS3,
    deleteFromS3
};