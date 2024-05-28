const comment = require("./../models/commentModel");
const fakeComment = require("./../models/fakeCommentModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const checkProfanity = require("./../utils/ProfanityDetector/profanityValidator");

class commentServices {
    static async getAll(post_id) {
        if (!post_id) throw new Error("Invalid id entry");
    
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
    
        if (results == null || results.length === 0) {
            throw new Error("Post with the given id doesn't have any comments");
        }
    
        const receivedCommentsForAPost = await Promise.all(results.map(async (result) => {
            let user = null;
            try {
                user = await prisma.user.findUnique({
                    where: {
                        uid: parseInt(result.author_id),
                    },
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }
    
            let is_teacher = false;
            if (user != null && parseInt(user.profesorFlag) == 1)
                is_teacher = true;
    
            const createdAtDate = new Date(result.created_at);
            const createdAtString = createdAtDate.toISOString();
            return new fakeComment(
                result.id,
                result.post_id,
                result.username,
                result.parent_id,
                result.author_id,
                result.description,
                result.votes,
                createdAtString,
                is_teacher
            );
        }));
    
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

    let profanityResult = await checkProfanity(description);
    profanityResult = JSON.parse(profanityResult);

    if(profanityResult.status){
        throw new Error("Description contains profane words: " + profanityResult.words);
    }
    
    let parsedVotes;
    if (votes === undefined) {
        parsedVotes = 0;
    } else if (isNaN(parseInt(votes))) {
        throw new Error("Invalid votes");
    } else {
        parsedVotes = parseInt(votes);
    }

    if(user_id !== author_id){
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

        let profanityResult = await checkProfanity(description);
        profanityResult = JSON.parse(profanityResult);

        if(profanityResult.status){
            throw new Error("Description contains profane words: " + profanityResult.words);
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
        user_id,
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

            let resultVote = null;
            try {
                resultVote = await prisma.commentsVotes.findMany({
                    where: {
                        user_id: parseInt(user_id),
                        comment_id: parseInt(result.id)
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            let difference = votes - result.votes;
            if(difference == 2 && resultVote[0] != null) { //inseamna ca user-ul a sters dislike-ul si a dat like si nu mai facuse deja asta
                if(resultVote[0].vote ==-1){

                    //trebuie update pe campul de vote in valoarea opusa
                    let results = null;
                    try {
                        results = await prisma.commentsVotes.updateMany({
                            where: {
                                user_id: parseInt(user_id),
                                comment_id: parseInt(result.id)
                            },
                            data: {
                                vote: 1
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                    if (results == null) 
                        throw new Error("PostsVotes couldn't be updated");
                }
                else throw new Error("Invalid vote entry - a like was already made");
                
            }  
            else if(difference == -2 && resultVote[0] != null){ //inseamna ca user-ul a sters like-ul si a dat dislike si nu mai facuse deja asta
                //trebuie update pe campul de vote in valoarea opusa
                if(resultVote[0].vote ==1){
                    let results = null;
                    try {
                        results = await prisma.commentsVotes.updateMany({
                            where: {
                                user_id: parseInt(user_id),
                                comment_id: parseInt(result.id)
                            },
                            data: {
                                vote: -1
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                    if (results == null) 
                        throw new Error("PostsVotes couldn't be updated");
                }
                else throw new Error("Invalid vote entry - a dislike was already made");
                      
            }  
            else if(difference == 1 || difference == -1) { //inseamna ca user-ul a dat dis/like sau si-a sters dis/like-ul

                if(resultVote[0] == null) { //daca nu exista deja in tabel, a dat dis/like, trebuie facut insert 

                    let results = null;
                    try {
                        results = await prisma.commentsVotes.create({
                            data: {
                                user_id: parseInt(user_id),
                                comment_id: parseInt(result.id),
                                vote: difference
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                    if (results == null) 
                        throw new Error("PostsVotes couldn't be updated");
                }
                else if( (difference == 1 && resultVote[0].vote == 1) || (difference == -1 && resultVote[0].vote == -1) ){ //vrea sa dea iar dis/like dar a dat deja
                    throw new Error("A like/dislike was already made by this user");
                } 
                else { 

                    //exista in tabel -> doar si a sters like-ul 
                    //facem delete din postsVotes
                    let deleteRow = null;
                    try {
                        deleteRow = await prisma.commentsVotes.deleteMany({
                            where: {
                                user_id: parseInt(user_id),
                                comment_id: parseInt(result.id),
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                }

            }
            else throw new Error("Invalid vote entry - cannot deduce user behaviour");

            let results = null;
            try {
                results = await prisma.comments.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        votes: parseInt(votes)
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

