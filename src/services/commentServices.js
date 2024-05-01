const comment = require("./../models/commentModel");
const dbQuery = require("./../utils/dbQuery");
const sql = require("./../utils/commentSql");

class commentServices {
    static async getAll(post_id) {
        if(!post_id) throw new Error("Invalid id entry");
        const values = [post_id];
        const results = await dbQuery(values, sql.sqlGetAll);
        const receivedCommentsForAPost = [];
        if(results.length > 0){
            results.forEach((result) => {
                const createdAtDate = new Date(result.created_at);
                const createdAtString = createdAtDate.toISOString();
                const receivedCommentForAPost = new comment(
                    result.id,
                    result.post_id,
                    result.parent_id,
                    result.author_id,
                    result.description,
                    result.votes,
                    createdAtString
                );
                receivedCommentsForAPost.push(receivedCommentForAPost);
            });
        }  else throw new Error("Post with the given id doesn't have any comments");
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
        parent_id,
        author_id,
        description,
        votes
    ) {
        const createdAt = new Date();

        if(!post_id || isNaN(parseInt(post_id)) || parseInt(post_id) <= 0)  
        throw new Error("Invalid post_id");
        const post_id_check = [post_id];
        const post_check = await dbQuery(post_id_check, sql.sqlGetPost);
        if(post_check.length == 0)
            throw new Error("Inexistent post_id");
        if(!parent_id || isNaN(parseInt(parent_id)))  
            throw new Error("Invalid parent_id");
        const parent_id_check=[parent_id]
        const parent_check = await dbQuery(parent_id_check, sql.sqlGet);
        if(parent_check.length == 0 && parent_id != -1)
            throw new Error("Inexistent parent_id");
        if(!author_id || isNaN(parseInt(author_id)) || parseInt(author_id) <= 0)  
            throw new Error("Invalid author_id");
        if(!description || description.length > 65535 || description.length == 0)
            throw new Error("Description entry too long/empty");
        if(!votes || isNaN(parseInt(votes)) || parseInt(votes) < 0)  
            throw new Error("Invalid votes");
        const values = [post_id,
            parent_id,
            author_id,
            description,
            votes,
            createdAt];
        const results = await dbQuery(values, sql.sqlPost);
    }

    static async putDescription(
        id,
        description
    ) {
        if(!id) throw new Error("Invalid id entry");
        if(!description || description.length > 65535 || description.length == 0)
        throw new Error("Description entry too long/empty");
        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if(result.length > 0){
            const values = [description, id];
            const results = await dbQuery(values, sql.sqlPutDescription);
        }
        else throw new Error("Comment with the given id doesn't exist");
    }
    static async putVotes(
        id,
        votes
    ) {
        if(!id) throw new Error("Invalid id entry");
        if(!votes || isNaN(parseInt(votes)) || parseInt(votes) < 0)  
        throw new Error("Invalid votes");
        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if(result.length > 0){
            const values = [votes, id];
            const results = await dbQuery(values, sql.sqlPutVotes);
        }
        else throw new Error("Comment with the given id doesn't exist"); 
    }
    static async delete(id) {
        if(!id) throw new Error("Invalid id entry");
        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if(result.length > 0){
            const queue = [id];
            while (queue.length > 0){
                const firstItem = queue.shift();

                const deleteResult = await dbQuery(firstItem, sql.sqlDelete);
                const values = [firstItem];

                const results = await dbQuery(values, sql.sqlGetIDsToDelete);

                results.forEach((result) => {
                    queue.push(result.id);
                });
        }}
        else throw new Error("Comment with the given id doesn't exist")
    }
    static async deleteByPost(post_id) {
        const values = [post_id];
        const results = await dbQuery(values, sql.sqlGetAll);
        if(results.length > 0){
        results.forEach((result) => {
            this.delete(result.id);
            });
        }
        else throw new Error("Post with the given id doesn't exist");
    }
}

module.exports = commentServices;

