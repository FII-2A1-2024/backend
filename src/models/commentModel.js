class Comment {
    constructor(
        id,
        post_id,
        parent_id,
        author_id,
        description,
        votes,
        created_at
    ) {
        this.id = id;
        this.post_id = post_id;
        this.parent_id = parent_id;
        this.author_id = author_id;
        this.description = description;
        this.votes = votes;
        this.created_at = created_at;
    }
}

module.exports = Comment;
