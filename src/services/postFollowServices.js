const postFollow = require("./../models/postFollowModel");
const dbQuery = require("./../utils/dbQuery");
const sql = require("./../utils/postFollowSql");

class PostFollowService {
    static async getByUser(user_id) {
        const results = await dbQuery([ user_id ], sql.sqlGetByUser);
        if (results && results.length > 0) {
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
        const results = await dbQuery([ post_id ], sql.sqlGetByPost);
        if (results && results.length > 0) {
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

        const values = [user_id, post_id];
        const results = await dbQuery(values, sql.sqlPost);
        if (!results) 
            throw new Error("Post follow couldn't be created");
    }
    static async deleteByUser(user_id) {
        if(!user_id) throw new Error("Invalid user_id entry");
        const result = await dbQuery([ user_id ], sql.sqlGetByUser);
        if (result && result.length > 0){
            const results = await dbQuery([ user_id ], sql.sqlDeleteByUser);
            if (!results) 
                throw new Error("Post follow couldn't be deleted");
        }
        else throw new Error("Post follow with the given user_id doesn't exist");
    }
    static async deleteByPost(post_id) {
        if(!post_id) throw new Error("Invalid post_id entry");
        const result = await dbQuery([ post_id ], sql.sqlGetByPost);
        if (result && result.length > 0){
            const results = await dbQuery([ post_id ], sql.sqlDeleteByPost);
            if (!results) 
                throw new Error("Post follow couldn't be deleted");
        }
        else throw new Error("Post follow with the given user_id doesn't exist");
    }
}

module.exports = PostFollowService;
