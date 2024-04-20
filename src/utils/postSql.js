const postSql = {
    sqlGet:
        "SELECT author_id, title, description, votes, created_at FROM Posts WHERE id=?",
    sqlGetAll:
        "SELECT id, author_id, title, description, votes, created_at FROM Posts",
    sqlPost:
        "INSERT INTO Posts (author_id, title, description, votes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    sqlPut:
        "UPDATE Posts SET author_id = ?, title = ?, description = ?, votes = ? WHERE id = ?",
    sqlDelete: "DELETE FROM Posts WHERE id = ?"
}

module.exports = postSql;
