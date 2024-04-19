const post = require("./../models/postModel");
const dbQuery = require("./../utils/dbQuery");
const sql = require("./../utils/postSql");

class PostService {
    static async get(id) {
        const values = [id];
        const result = await dbQuery(values, sql.sqlGet);
        const createdAtDate = new Date(result[0].created_at);
        const createdAtString = createdAtDate.toISOString();
        const receivedPost = new post(
            result[0].id,
            result[0].author_id,
            result[0].thread_id,
            result[0].title,
            result[0].description,
            result[0].votes,
            createdAtString
        );
        return receivedPost;
    }
    static async getAll() {
        const results = await dbQuery([], sql.sqlGetAll);
        const receivedPosts = [];
        results.forEach((result) => {
            const createdAtDate = new Date(result.created_at);
            const createdAtString = createdAtDate.toISOString();
            const receivedPost = new post(
                result.id,
                result.author_id,
                result.thread_id,
                result.title,
                result.description,
                result.votes,
                createdAtString
            );
            receivedPosts.push(receivedPost);
        });
        return receivedPosts;
    }
    static async post(
        author_id,
        thread_id,
        title,
        description,
        votes
    ) {
        const createdAt = new Date();
        const values = [author_id, thread_id, title, description, votes, createdAt];
        const results = await dbQuery(values, sql.sqlPost);
    }
    static async put(
        id,
        author_id,
        thread_id,
        title,
        description,
        votes
    ) {
        const values = [author_id, thread_id, title, description, votes, id];
        const results = await dbQuery(values, sql.sqlPut);
    }
    static async delete(id) {
        const values = [id];
        const results = await dbQuery(values, sql.sqlDelete);
    }
}

module.exports = PostService;
