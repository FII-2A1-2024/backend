const postServices = require("./../services/postServices");
const multer = require('multer');
const upload = multer({ dest: 'uploads.local/' });
const { uploadToS3, deleteFromS3 } = require('./../utils/AWS');
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require('fs');
const { log } = require("console");

class PostController {
    static async get(req, res) {
        const id = parseInt(req.query.id);
        try {
            const post = await postServices.get(id);
            res.status(200).json({ "status":"ok", post });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const posts = await postServices.getAll();
            res.status(200).json({ "status":"ok", posts });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async post(req, res) {   
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.decode(token);

        upload.single('file')(req, res, async function(err) {
            if (err) {
                return res.status(500).json({ "status": "err", "message": err.message });
            }
    
            const {author_id, username, title, description, category } = req.body;
            const file = req.file;

            try {
                let url = null;
                if (file != undefined) {
                    url = await uploadToS3(file);
                    fs.unlinkSync(file.path);
                }

                const users = await prisma.user.findMany({
                    where: {
                      emailPrimary: decodedToken.user,
                    },
                  });
          
                  const user = users.length > 0 ? users[0] : null;
                  if (!user) {
                    return res.status(404).json({ "status": "err", "message": "User not found" });
                  }
                
                const post = await postServices.post(author_id, user.uid, username, title, description, category, url);
                res.status(200).json({ "status": "ok", post });
            } catch (error) {
                res.status(500).json({ "status": "err", "message": error.message });
            } 
        });
    }
    static async put(req, res) {
        upload.single('file')(req, res, async function(err) {
            if (err) {
                return res.status(500).json({ "status": "err", "message": err.message });
            }

            const { user_id, id, title, description, votes, category } = req.body;
            const file = req.file;

            try {
                if (title !== undefined && description == undefined && votes == undefined && category == undefined && file == undefined) {
                    await postServices.putTitle(id, title);
                } else if (description !== undefined && title == undefined && votes == undefined && category == undefined && file == undefined) {
                    await postServices.putDescription(id, description);
                } else if (votes !== undefined && title == undefined && description == undefined && category == undefined && file == undefined) {
                    await postServices.putVotes(user_id, id, votes);
                } else if (votes == undefined && title == undefined && description == undefined && category !== undefined && file == undefined) {
                    await postServices.putCategory(id, category);
                } else if (votes == undefined && title == undefined && description == undefined && category == undefined && file != undefined) {
                    const post = await postServices.get(id);
                    if (post.url != null)
                        await deleteFromS3(post.url);
                    const url = await uploadToS3(file);
                    fs.unlinkSync(file.path);
                    await postServices.putUrl(id, url);
                } else {
                    throw new Error("Too many or few parameters");
                }
                const post = await postServices.get(id);
                res.status(200).json({ "status":"ok", post});
            } catch (error) {
                res.status(500).json({ "status":"err", "message": error.message });
            }
        });
    }
    static async delete(req, res) {
        const id = parseInt(req.query.id);
        try {
            const post = await postServices.get(id);
            if (post.url != null)
                await deleteFromS3(post.url);
            await postServices.delete(id);
            res.status(200).json({ "status":"ok", "message":"post deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async deleteFile(req, res) {
        const id = parseInt(req.query.id);
        try {
            const post = await postServices.get(id);
            if (post.url != null) {
                await deleteFromS3(post.url);
                await postServices.deleteFile(id);
            }
            res.status(200).json({ "status":"ok", "message":"post file deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
}

module.exports = PostController;
