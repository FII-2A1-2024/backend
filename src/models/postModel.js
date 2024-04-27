class Post {
    constructor(
        id,
        author_id,
        title,
        description,
        votes,
        created_at,
        category
    ) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.description = description;
        this.votes = votes;
        this.created_at = created_at;
        this.category = category;
    }
}

module.exports = Post;
