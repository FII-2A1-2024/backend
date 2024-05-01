const post = require("./../models/postModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const commentServices = require("./commentServices");

class PostService {
    static async get(id) {
        if(!id) throw new Error("Invalid id entry");

        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null) {
            const createdAtDate = new Date(result.created_at);
            const createdAtString = createdAtDate.toISOString();
            const receivedPost = new post(
                result.id,
                result.author_id,
                result.title,
                result.description,
                result.votes,
                createdAtString,
                result.category
            );
            return receivedPost;
        } else {
            throw new Error("No post found with the given id");
        }
    }

    static async getAll() {
        let results = null;
        try {
            results = await prisma.posts.findMany();
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (results != null  && results.length > 0) {
            const receivedPosts = [];
            results.forEach((result) => {
                const createdAtDate = new Date(result.created_at);
                const createdAtString = createdAtDate.toISOString();
                const receivedPost = new post(
                    result.id,
                    result.author_id,
                    result.title,
                    result.description,
                    result.votes,
                    createdAtString,
                    result.category
                );
                receivedPosts.push(receivedPost);
            });
            return receivedPosts;
        } else {
            throw new Error("No posts found in the database");
        }
    }

    static async post(
        author_id,
        title,
        description,
        votes,
        category
    ) {
        const createdAt = new Date();

        if(!author_id || isNaN(parseInt(author_id)) || parseInt(author_id) <= 0)  
            throw new Error("Invalid author_id");
        if(!title || title.length > 50 || title.length == 0)
            throw new Error("Title entry too long/empty");
        if(!description || description.length > 65535 || description.length == 0)
            throw new Error("Description entry too long/empty");
        if(!votes || isNaN(parseInt(votes)) || parseInt(votes) < 0)  
            throw new Error("Invalid votes");
        if(!category || category.length > 50 || category.length == 0)
            throw new Error("Category entry too long/empty");

        let results = null;
        try {
            results = await prisma.posts.create({
                data: {
                    author_id: author_id,
                    title: title,
                    description: description,
                    votes: votes,
                    created_at: createdAt,
                    category: category
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (results == null) 
            throw new Error("Post couldn't be created");
    }

    static async putTitle(
        id,
        title
    ) {
        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null){
            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if(!title || title.length > 50 || title.length == 0)
                throw new Error("Title entry too long/empty");

            let results = null;
            try {
                results = await prisma.posts.update({
                    where: {
                        id: id
                    },
                    data: {
                        title: title
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");
    }

    static async putDescription(
        id,
        description
    ) {
        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null){
            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if(!description || description.length > 65535 || description.length == 0)
                throw new Error("Description entry too long/empty");

            let results = null;
            try {
                results = await prisma.posts.update({
                    where: {
                        id: id
                    },
                    data: {
                        description: description
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");
    }

    static async putVotes(
        id,
        votes
    ) {
        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null){
            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if(!votes || isNaN(parseInt(votes)) || parseInt(votes) < 0)  
                throw new Error("Invalid votes");

            let results = null;
            try {
                results = await prisma.posts.update({
                    where: {
                        id: id
                    },
                    data: {
                        votes: votes
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");
    }

    static async delete(id) {
        if(!id) throw new Error("Invalid id entry");
        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null){
            let results = null;
            try {
                results = await prisma.posts.delete({
                    where: {
                        id: id
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post couldn't be deleted");
        }
        else throw new Error("Post with the given id doesn't exist");
        
        commentServices.deleteByPost(id);
    }
}

module.exports = PostService;
