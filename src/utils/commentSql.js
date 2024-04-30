const { sqlPutDescription } = require("./postSql");

const commentSql = {
    sqlGetAll:
        "SELECT id, post_id, parent_id, author_id, description, votes, votes, created_at FROM Comments WHERE post_id = ?",
    sqlPost:
        "INSERT INTO Comments (post_id, parent_id, author_id, description, votes, created_at) VALUES ( ?, ?, ?, ?, ?, ?)",
    sqlPutDescription:
        "UPDATE Comments SET description = ? WHERE id = ?",
    sqlPutVotes:
        "UPDATE Comments SET votes = ? WHERE id = ?",
    sqlGetIDsToDelete: 
        "SELECT id from Comments WHERE parent_id = ?",
    sqlDelete: 
        "DELETE FROM Comments WHERE id = ?"
}


module.exports = commentSql;
