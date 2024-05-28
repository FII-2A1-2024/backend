//if you read this fu@k you and f$*k me too
class Post {
    constructor(
        id,
        author_id,
        username,
        title,
        description,
        votes,
        created_at,
        category,
        comments_count,
        url,
        is_teacher
    ) {
        this.id = id;
        this.author_id = author_id;
        this.username = username;
        this.title = title;
        this.description = description;
        this.votes = votes;
        this.created_at = created_at;
        this.category = category;
        this.comments_count = comments_count;
        this.url = url;
        this.is_teacher = is_teacher;
    }
}

module.exports = Post;
