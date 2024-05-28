//FU$K THIS TOO
class Comment {
    constructor(
        id,
        post_id,
        username,
        parent_id,
        author_id,
        description,
        votes,
        created_at,
        is_teacher
    ) {
        this.id = id;
        this.post_id = post_id;
        this.username = username;
        this.parent_id = parent_id;
        this.author_id = author_id;
        this.description = description;
        this.votes = votes;
        this.created_at = created_at;
        this.is_teacher = is_teacher;
    }
}

module.exports = Comment;
