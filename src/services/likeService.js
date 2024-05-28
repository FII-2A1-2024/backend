const FakeUser = require("./../models/fakeUserModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class likeService {

    static async getFromPost(post_id) {

        if (!post_id) throw new Error("Invalid post_id entry");

        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: parseInt(post_id),
                },
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null) {
            let likes = null;
            try {
                likes = await prisma.postsVotes.findMany({
                    where: {
                        post_id: parseInt(result.id),
                    },
                });
            } catch (error) {
                await prisma.$disconnect();
            } finally {
                await prisma.$disconnect();
            }
            
            if (likes == null || likes.length === 0) {
                throw new Error("Post with the given id doesn't have any likes");
            }
        
            const receivedLikesForAPost = await Promise.all(likes.map(async (result) => {
                let user = null;
                try {
                    user = await prisma.user.findUnique({
                        where: {
                            uid: parseInt(result.user_id),
                        },
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
        
                return new FakeUser(
                    user.uid,
                    user.password,
                    user.emailPrimary,
                    user.emailSecondary,
                    user.profesorFlag, 
                    user.verifiedEmail,
                    result.vote
                );
            }));

            return receivedLikesForAPost;

        } else {
            throw new Error("No post found with the given id");
        }

    }

    static async getLikedPosts(user_id) {

    }

    static async getFromComment(comment_id) {

        if (!comment_id) throw new Error("Invalid comment_id entry");

        let result = null;
        try {
            result = await prisma.comments.findUnique({
                where: {
                    id: parseInt(comment_id),
                },
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null) {
            let likes = null;
            try {
                likes = await prisma.commentsVotes.findMany({
                    where: {
                        comment_id: parseInt(result.id),
                    },
                });
            } catch (error) {
                await prisma.$disconnect();
            } finally {
                await prisma.$disconnect();
            }
            
            if (likes == null || likes.length === 0) {
                throw new Error("Comment with the given id doesn't have any likes");
            }
        
            const receivedLikesForAComment = await Promise.all(likes.map(async (result) => {
                let user = null;
                try {
                    user = await prisma.user.findUnique({
                        where: {
                            uid: parseInt(result.user_id),
                        },
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
        
                return new FakeUser(
                    user.uid,
                    user.password,
                    user.emailPrimary,
                    user.emailSecondary,
                    user.profesorFlag, 
                    user.verifiedEmail,
                    result.vote
                );
            }));

            return receivedLikesForAComment;

        } else {
            throw new Error("No comment found with the given id");
        }


    }

    static async getLikedComments(user_id) {

    }
}



    
module.exports = likeService;