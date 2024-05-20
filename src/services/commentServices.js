const comment = require("./../models/commentModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class commentServices {
    static async getAll(post_id) {
        if(!post_id) throw new Error("Invalid id entry");

        let results = null;
        try {
            results = await prisma.comments.findMany({
                where: {
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        const receivedCommentsForAPost = [];
        if(results != null && results.length > 0){
            results.forEach((result) => {
                const createdAtDate = new Date(result.created_at);
                const createdAtString = createdAtDate.toISOString();
                const receivedCommentForAPost = new comment(
                    result.id,
                    result.post_id,
                    result.username,
                    result.parent_id,
                    result.author_id,
                    result.description,
                    result.votes,
                    createdAtString
                );
                receivedCommentsForAPost.push(receivedCommentForAPost);
            });
        }  
        else throw new Error("Post with the given id doesn't have any comments");

        const nestedJSONArray = receivedCommentsForAPost
        .filter(comment => comment.parent_id === -1)
        .map(comment => this.buildNestedJSON(receivedCommentsForAPost, comment));

        return nestedJSONArray;
    }

    static extractSubcomments(commentsArray, parentId) {
        return commentsArray.filter(comment => comment.parent_id === parentId);
    }

    static buildNestedJSON(commentsArray, comment) {
        const subcomments = this.extractSubcomments(commentsArray, comment.id);
        if (subcomments.length === 0) {
            return { detaliiComentariu: comment };
        }
        const nestedSubcomments = subcomments.map(subcomment => this.buildNestedJSON(commentsArray, subcomment));
        return { detaliiComentariu: comment, subcomentarii: nestedSubcomments };
    }
    
static async post(
    post_id,
    username,
    parent_id,
    author_id,
    user_id,
    description,
    votes
) {
    const createdAt = new Date();

    if (!post_id || isNaN(parseInt(post_id)) || parseInt(post_id) <= 0)
        throw new Error("Invalid post_id");
    let result = null;
    try {
        result = await prisma.posts.findUnique({
            where: {
                id: post_id
            }
        });
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
    if (result == null)
        throw new Error("Inexistent post_id");

    if (!parent_id || isNaN(parseInt(parent_id)))
        throw new Error("Invalid parent_id");
    result = null;
    try {
        result = await prisma.comments.findUnique({
            where: {
                id: parent_id
            }
        });
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
    if (result == null && parent_id != -1)
        throw new Error("Inexistent parent_id");

    if (!author_id || isNaN(parseInt(author_id)) || parseInt(author_id) <= 0)
        throw new Error("Invalid author_id");
    if (!user_id || isNaN(parseInt(user_id)) || parseInt(user_id) <= 0)
        throw new Error("Invalid user_id from token");
    if (!description || description.length > 65535 || description.length == 0)
        throw new Error("Description entry too long/empty");
    if(!username || username.length > 50 || username.length == 0)
        throw new Error("Username too long/empty");
    let parsedVotes;
    if (votes === undefined) {
        parsedVotes = 0;
    } else if (isNaN(parseInt(votes))) {
        throw new Error("Invalid votes");
    } else {
        parsedVotes = parseInt(votes);
    }

    if(uid !== author_id){
        throw new Error("User_id and author_id not equal");
    }

    let results = null;
    try {
        results = await prisma.comments.create({
            data: {
                post_id: post_id,
                username: username,
                parent_id: parent_id,
                author_id: author_id,
                description: description,
                votes: parsedVotes,
                created_at: createdAt
            }
        });
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }

    if (results == null)
        throw new Error("Comment couldn't be created");
    try {
        await prisma.posts.update({
            where: {
                id: post_id
            },
            data: {
                comments_count: {
                    increment: 1
                }
            }
        });
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }

    // Returnăm ID-ul comentariului creat
    return results.id;
}

    static async putDescription(
        id,
        description
    ) {
        if(!id) throw new Error("Invalid id entry");
        if(!description || description.length > 65535 || description.length == 0)
            throw new Error("Description entry too long/empty");

        let result = null;
        try {
            result = await prisma.comments.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if(result != null){
            let results = null;
            try {
                results = await prisma.comments.update({
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
                throw new Error("Comment couldn't be updated");

        }
        else throw new Error("Comment with the given id doesn't exist");


    }


    static async putVotes(
        id,
        votes
    ) {
        if(!id) throw new Error("Invalid id entry");
        if (isNaN(parseInt(votes))) {
            throw new Error("Invalid votes");
        }
        
        let result = null;
        try {
            result = await prisma.comments.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if(result != null){
            let results = null;
            try {
                results = await prisma.comments.update({
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
                throw new Error("Comment couldn't be updated");
        }
        else throw new Error("Comment with the given id doesn't exist"); 


    }

    static async delete(id) {
        if (!id) throw new Error("Invalid id entry");
    
        let result = null;
        try {
            result = await prisma.comments.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        }
    
        if (result != null) {
            const queue = [id];
            while (queue.length > 0) {
                const firstItem = queue.shift();
    
                let deleteResults = null;
                try {
                    deleteResults = await prisma.comments.delete({
                        where: {
                            id: firstItem
                        }
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
    
                if (deleteResults == null)
                    throw new Error("Comment couldn't be deleted");
    
                let postResult = null;
                try {
                    postResult = await prisma.posts.findUnique({
                        where: {
                            id: result.post_id
                        }
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
    
                if (postResult != null) {
                    try {
                        await prisma.posts.update({
                            where: {
                                id: result.post_id
                            },
                            data: {
                                comments_count: {
                                    decrement: 1
                                }
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                }
    
                let results = null;
                try {
                    results = await prisma.comments.findMany({
                        where: {
                            parent_id: firstItem
                        }
                    });
                } catch (error) {
                    throw error;
                } finally {
                    await prisma.$disconnect();
                }
    
                results.forEach((result) => {
                    queue.push(result.id);
                });
            }
        } else {
            throw new Error("Comment with the given id doesn't exist")
        }
    
    }
    static async deleteByPost(post_id) {
        let results = null;
        try {
            results = await prisma.comments.findMany({
                where: {
                    post_id: post_id
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }
        
        if(results != null  && results.length > 0){
            results.forEach((result) => {
                this.delete(result.id);
            });
        }
    }
}

module.exports = commentServices;

