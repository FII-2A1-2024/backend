class Post {
    constructor(
        id,
        author_id,
        title,
        description,
        votes,
        created_at
    ) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.description = description;
        this.votes = votes;
        this.created_at = created_at;
    }
}

module.exports = Post;
