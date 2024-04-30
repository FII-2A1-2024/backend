const postFollowSql = {
    sqlGetByUser:
        "SELECT * FROM PostsFollow WHERE user_id=?",
    sqlGetByPost:
        "SELECT * FROM PostsFollow WHERE post_id=?",
    sqlPost:
        "INSERT INTO PostsFollow (user_id, post_id) VALUES (?, ?)",
    sqlDeleteByUser: 
        "DELETE FROM PostsFollow WHERE user_id = ?",
    sqlDeleteByPost: 
        "DELETE FROM PostsFollow WHERE post_id = ?"
}

module.exports = postFollowSql;
