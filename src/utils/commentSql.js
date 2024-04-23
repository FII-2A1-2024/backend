const commentSql = {
    sqlGet:
        "SELECT id, post_id, parent_id, author_id, description, votes, votes, created_at FROM Comments WHERE post_id = ?",
    sqlPost:
        "INSERT INTO Comments (post_id, parent_id, author_id, description, votes, created_at) VALUES ( ?, ?, ?, ?, ?, ?)",
    sqlPut:
        "UPDATE Comments SET description = ? WHERE id = ?",
    
    sqlGetIDsToDelete: 
        "SELECT id from Comments WHERE post_id = ? and parent_id = ?",

    sqlDelete: 
        "DELETE FROM Comments WHERE id = ?"
}


module.exports = commentSql;
