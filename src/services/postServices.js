const post = require("./../models/postModel");
const dbQuery = require("./../utils/dbQuery");
const sql = require("./../utils/postSql");
const commentServices = require("./commentServices");

class PostService {
    static async get(id) {

        if(!id) throw new Error("Invalid id entry");
        const values = [id];
        const result = await dbQuery(values, sql.sqlGet);
        if (result && result.length > 0) {
            const createdAtDate = new Date(result[0].created_at);
            const createdAtString = createdAtDate.toISOString();
            const receivedPost = new post(
                result[0].id,
                result[0].author_id,
                result[0].title,
                result[0].description,
                result[0].votes,
                createdAtString,
                result[0].category
            );
            return receivedPost;
        } else {
            throw new Error("No post found with the given id");
        }
    }
    static async getAll() {
        const results = await dbQuery([], sql.sqlGetAll);
        if (results && results.length > 0) {
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

        const values = [author_id, title, description, votes, createdAt, category];
        const results = await dbQuery(values, sql.sqlPost);
        if (!results) 
            throw new Error("Post couldn't be created");
    }
    static async putTitle(
        id,
        title
    ) {

        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if (result && result.length > 0){

            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if(!title || title.length > 50 || title.length == 0)
                throw new Error("Title entry too long/empty");

            const values = [title, id];
            const results = await dbQuery(values, sql.sqlPutTitle);
            if (!results) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");

    }
    static async putDescription(
        id,
        description
    ) {

        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if (result && result.length > 0){

            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if(!description || description.length > 65535 || description.length == 0)
                throw new Error("Description entry too long/empty");

            const values = [description, id];
            const results = await dbQuery(values, sql.sqlPutDescription);
            if (!results) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");

    }
    static async putVotes(
        id,
        votes
    ) {

        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if (result && result.length > 0){

            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if(!votes || isNaN(parseInt(votes)) || parseInt(votes) < 0)  
                throw new Error("Invalid votes");

            const values = [votes, id];
            const results = await dbQuery(values, sql.sqlPutVotes);
            if (!results) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");

    }
    static async delete(id) {

        if(!id) throw new Error("Invalid id entry");
        const to_check = [id];
        const result = await dbQuery(to_check, sql.sqlGet);
        if (result && result.length > 0){
            const values = [id];
            const results = await dbQuery(values, sql.sqlDelete);
            if (!results) 
                throw new Error("Post couldn't be deleted");
        }
        else throw new Error("Post with the given id doesn't exist");
        commentServices.deleteByPost(id);
    }
}

module.exports = PostService;
