const FakeUser = require("./../models/fakeUserModel");
const FakePostWithUserVote = require("./../models/fakePostModelWithUserVote");
const FakeCommentWithUserVote = require("./../models/fakeCommentWithUserVote");

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

        if (!user_id) throw new Error("Invalid user_id entry");

        //verificam daca id-ul userului este unul valid
        let result = null;
        try {
            result = await prisma.user.findUnique({
                where: {
                    uid: parseInt(user_id),
                },
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null) {
            let posts = null;
            try {
                posts = await prisma.postsVotes.findMany({
                    where: {
                        user_id: parseInt(user_id),
                    },
                });
            } catch (error) {
                await prisma.$disconnect();
            } finally {
                await prisma.$disconnect();
            }
            
            if (posts == null || posts.length === 0) {
                throw new Error("User with the given id doesn't have any liked posts");
            }
        
            const receivedLikedPosts = await Promise.all(posts.map(async (result) => {
                let post = null;
                try {
                    post = await prisma.posts.findUnique({
                        where: {
                            id: parseInt(result.post_id),
                        },
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
        
                return new FakePostWithUserVote(
                    post.id,
                    post.author_id,
                    post.username,
                    post.title,
                    post.description,
                    post.votes,
                    post.created_at,
                    post.category,
                    post.comments_count,
                    post.url,
                    post.is_teacher,
                    result.vote
                );
            }));

            return receivedLikedPosts;

        } else {
            throw new Error("No user found with the given id");
        }

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

        if (!user_id) throw new Error("Invalid user_id entry");

        //verificam daca id-ul userului este unul valid
        let result = null;
        try {
            result = await prisma.user.findUnique({
                where: {
                    uid: parseInt(user_id),
                },
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null) {
            let comments = null;
            try {
                comments = await prisma.commentsVotes.findMany({
                    where: {
                        user_id: parseInt(user_id),
                    },
                });
            } catch (error) {
                await prisma.$disconnect();
            } finally {
                await prisma.$disconnect();
            }
            
            if (comments == null || comments.length === 0) {
                throw new Error("User with the given id doesn't have any liked comments");
            }
        
            const receivedLikedComments = await Promise.all(comments.map(async (result) => {
                let comment = null;
                try {
                    comment = await prisma.comments.findUnique({
                        where: {
                            id: parseInt(result.comment_id),
                        },
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
        
                return new FakeCommentWithUserVote(
                    comment.id,
                    comment.post_id,
                    comment.username,
                    comment.parent_id,
                    comment.author_id,
                    comment.description,
                    comment.votes,
                    comment.created_at,
                    result.vote
                );
            }));

            return receivedLikedComments;

        } else {
            throw new Error("No user found with the given id");
        }

    }
}
    
module.exports = likeService;