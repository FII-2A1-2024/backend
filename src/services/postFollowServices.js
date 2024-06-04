const postFollow = require("./../models/postFollowModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PostFollowService {
    static async getByUser(user_id) {
        let results = null;
        try {
            results = await prisma.postsFollow.findMany({
                where: {
                    user_id: user_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (results != null  && results.length > 0) {
            const receivedPostsFollow = [];
            results.forEach((result) => {
                const receivedPostFollow = new postFollow(
                    result.user_id,
                    result.post_id,
                );
                receivedPostsFollow.push(receivedPostFollow);
            });
            return receivedPostsFollow;
        } else {
            throw new Error("No posts follow found in the database");
        }
    }

    static async getByPost(post_id) {
        let results = null;
        try {
            results = await prisma.postsFollow.findMany({
                where: {
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (results != null  && results.length > 0) {
            const receivedPostsFollow = [];
            results.forEach((result) => {
                const receivedPostFollow = new postFollow(
                    result.user_id,
                    result.post_id,
                );
                receivedPostsFollow.push(receivedPostFollow);
            });
            return receivedPostsFollow;
        } else {
            throw new Error("No posts follow found in the database");
        }
    }

    static async post(
        user_id,
        post_id
    ) {
        if(!user_id || isNaN(parseInt(user_id)) || parseInt(user_id) <= 0)  
            throw new Error("Invalid user_id");
        if(!post_id || isNaN(parseInt(post_id)) || parseInt(post_id) <= 0)  
            throw new Error("Invalid post_id");

        let result = null;
        try {
            result = await prisma.postsFollow.findMany({
                where: {
                    user_id: user_id,
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if(result != null && result.length > 0 )
            throw new Error("Post follow already exists");

        let results = null;
        try {
            results = await prisma.postsFollow.create({
                data: {
                    user_id: user_id,
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }
        
        if (results == null) 
            throw new Error("Post follow couldn't be created");

        return results;
    }

    static async delete(user_id, post_id) {
        if(!user_id) throw new Error("Invalid user_id entry");
        if(!post_id) throw new Error("Invalid post_id entry");

        let result = null;
        try {
            result = await prisma.postsFollow.findMany({
                where: {
                    user_id: user_id,
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null  && result.length > 0){
            let results = null;
            try {
                results = await prisma.postsFollow.deleteMany({
                    where: {
                        user_id: user_id,
                        post_id: post_id
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post follow couldn't be deleted");
        }
        else throw new Error("Post follow with the given user_id doesn't exist");
    }

    static async deleteByUser(user_id) {
        if(!user_id) throw new Error("Invalid user_id entry");

        let result = null;
        try {
            result = await prisma.postsFollow.findMany({
                where: {
                    user_id: user_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null  && result.length > 0){
            let results = null;
            try {
                results = await prisma.postsFollow.deleteMany({
                    where: {
                        user_id: user_id
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post follow couldn't be deleted");
        }
        else throw new Error("Post follow with the given user_id doesn't exist");
    }

    static async deleteByPost(post_id) {
        if(!post_id) throw new Error("Invalid post_id entry");

        let result = null;
        try {
            result = await prisma.postsFollow.findMany({
                where: {
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null  && result.length > 0){
            let results = null;
            try {
                results = await prisma.postsFollow.deleteMany({
                    where: {
                        post_id: post_id
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post follow couldn't be deleted");
        }
        else throw new Error("Post follow with the given user_id doesn't exist");
    }
}

module.exports = PostFollowService;
