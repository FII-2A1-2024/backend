const comment = require("./../models/commentModel");
const dbQuery = require("./../utils/dbQuery");
const sql = require("./../utils/commentSql");

class commentServices {
    static async get(id) {
        const values = [id];
        const results = await dbQuery(values, sql.sqlGet);
        const receivedCommentsForAPost = [];

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
        const values = [post_id,
            parent_id,
            author_id,
            description,
            votes,
            createdAt];
        const results = await dbQuery(values, sql.sqlPost);
    }
    static async put(
        id,
        description
    ) {
        const values = [description, id];
        const results = await dbQuery(values, sql.sqlPut);
    }
    static async delete(id, post_id) {

        const queue = [id];
        while (queue.length > 0){
            const firstItem = queue.shift();
            const deleteResult = await dbQuery(firstItem, sql.sqlDelete);
            const values = [post_id, firstItem];

            const results = await dbQuery(values, sql.sqlGetIDsToDelete);

            results.forEach((result) => {
                queue.push(result.id);
            });
        }
    }
}


module.exports = commentServices;

