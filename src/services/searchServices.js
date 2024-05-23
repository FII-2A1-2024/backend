const postServices = require("./postServices");

class SearchServices {
	async getAll(req, res) {
		try {
			const posts = await postServices.getAll();

			const returnPosts = posts
				.filter((value) => value.votes >= 0)
				.sort(SearchServices.sortByPopularity)
				.concat(
					posts
						.filter((value) => value.votes < 0)
						.sort(SearchServices.sortByPopularity),
				);
			res.status(200).json({ status: "ok", posts: returnPosts });
		} catch (error) {
			res.status(500).json({ status: "err", message: error.message });
		}
	}

	async getByCategory(req, res) {
		try {
			const posts = await postServices.getByCategory(req.query.category);

			const returnPosts = posts
				.filter((value) => value.votes >= 0)
				.sort(SearchServices.sortByPopularity)
				.concat(
					posts
						.filter((value) => value.votes < 0)
						.sort(SearchServices.sortByPopularity),
				);
			res.status(200).json({ status: "ok", posts: returnPosts });
		} catch (error) {
			res.status(500).json({ status: "err", message: error.message });
		}
	}

	static sortByPopularity(a, b) {
		// All posts are sorted by date and votes
		// all posts that have negative votes wwill be
		// at the end of the array
		const dateA = Date.now() - Date.parse(a.created_at);
		const dateB = Date.now() - Date.parse(b.created_at);
		const dateDiff = dateA - dateB;
		const votesDiff = b.votes - a.votes;
		if (dateDiff === 0) return votesDiff;
		return dateDiff;
	}
}

module.exports = new SearchServices();
