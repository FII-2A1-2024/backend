const post = require("./../models/postModel");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const commentServices = require("./commentServices");
const checkProfanity = require("./../utils/ProfanityDetector/profanityValidator");

class PostService {
	static async get(id) {
		if (!id) throw new Error("Invalid id entry");

		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			const createdAtDate = new Date(result.created_at);
			const createdAtString = createdAtDate.toISOString();
			const receivedPost = new post(
				result.id,
				result.author_id,
				result.username,
				result.title,
				result.description,
				result.votes,
				createdAtString,
				result.category,
				result.comments_count,
				result.url,
			);
			return receivedPost;
		} else {
			throw new Error("No post found with the given id");
		}
	}

	static async getByCategory(category) {
		if (!category) throw new Error("Invalid category entry");

		const result = await prisma.posts.findMany({
			where: {
				category: category,
			},
		});
		await prisma.$disconnect();
		return result;
	}

	static async getAll() {
		let results = null;
		try {
			results = await prisma.posts.findMany();
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (results != null && results.length > 0) {
			const receivedPosts = [];
			results.forEach((result) => {
				const createdAtDate = new Date(result.created_at);
				const createdAtString = createdAtDate.toISOString();
				const receivedPost = new post(
					result.id,
					result.author_id,
					result.username,
					result.title,
					result.description,
					result.votes,
					createdAtString,
					result.category,
					result.comments_count,
					result.url,
				);
				receivedPosts.push(receivedPost);
			});
			return receivedPosts;
		} else {
			throw new Error("No posts found in the database");
		}
	}

	static async post(
		author_id,
		uid,
		username,
		title,
		description,
		votes,
		category,
		url,
	) {
		const createdAt = new Date();

		if (!author_id || isNaN(parseInt(author_id)) || parseInt(author_id) <= 0)
			throw new Error("Invalid author_id");
		if (!uid || isNaN(parseInt(uid)) || parseInt(uid) <= 0)
			throw new Error("Invalid user id from token");
		if (!title || title.length > 50 || title.length == 0)
			throw new Error("Title entry too long/empty");
		if (!username || username.length > 50 || username.length == 0)
			throw new Error("Username too long/empty");
		if (!description || description.length > 65535 || description.length == 0)
			throw new Error("Description entry too long/empty");
		if (!category || category.length > 50 || category.length == 0)
			throw new Error("Category entry too long/empty");
		if (url != null && (url.length > 255 || url.length == 0))
			throw new Error("URL entry too long/empty");

		if (uid !== author_id) {
			throw new Error("User_id and author_id not equal");
		}

		let profanityResult = await checkProfanity(title);
		profanityResult = JSON.parse(profanityResult);

		if (profanityResult.status) {
			throw new Error("Title contains profane words: " + profanityResult.words);
		}

		profanityResult = await checkProfanity(description);
		profanityResult = JSON.parse(profanityResult);

		if (profanityResult.status) {
			throw new Error(
				"Description contains profane words: " + profanityResult.words,
			);
		}

		let parsedVotes;
		if (votes === undefined) {
			parsedVotes = 0;
		} else if (isNaN(parseInt(votes))) {
			throw new Error("Invalid votes");
		} else {
			parsedVotes = parseInt(votes);
		}

		let results = null;
		try {
			results = await prisma.posts.create({
				data: {
					author_id: parseInt(author_id),
					username: username,
					title: title,
					description: description,
					votes: parsedVotes,
					created_at: createdAt,
					category: category,
					comments_count: 0,
					url: url,
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (results == null) throw new Error("Post couldn't be created");

		const post = {
			author_id: parseInt(author_id),
			title: title,
			username: username,
			description: description,
			votes: parsedVotes,
			created_at: createdAt,
			category: category,
			comments_count: 0,
			url: url,
		};

		return post;
	}

	static async putTitle(id, title) {
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0)
				throw new Error("Invalid id");
			if (!title || title.length > 50 || title.length == 0)
				throw new Error("Title entry too long/empty");

			let profanityResult = await checkProfanity(title);
			profanityResult = JSON.parse(profanityResult);

			if (profanityResult.status) {
				throw new Error(
					"Title contains profane words: " + profanityResult.words,
				);
			}

			let results = null;
			try {
				results = await prisma.posts.update({
					where: {
						id: parseInt(id),
					},
					data: {
						title: title,
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post couldn't be updated");
		} else throw new Error("Post with the given id doesn't exist");
	}

	static async putDescription(id, description) {
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0)
				throw new Error("Invalid id");
			if (!description || description.length > 65535 || description.length == 0)
				throw new Error("Description entry too long/empty");

			let profanityResult = await checkProfanity(description);
			profanityResult = JSON.parse(profanityResult);

			if (profanityResult.status) {
				throw new Error(
					"Description contains profane words: " + profanityResult.words,
				);
			}
			let results = null;
			try {
				results = await prisma.posts.update({
					where: {
						id: parseInt(id),
					},
					data: {
						description: description,
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post couldn't be updated");
		} else throw new Error("Post with the given id doesn't exist");
	}

	static async putCategory(id, category) {
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0)
				throw new Error("Invalid id");
			if (!category || category.length > 50 || category.length == 0)
				throw new Error("Description entry too long/empty");

			let results = null;
			try {
				results = await prisma.posts.update({
					where: {
						id: parseInt(id),
					},
					data: {
						category: category,
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post couldn't be updated");
		} else throw new Error("Post with the given id doesn't exist");
	}

	static async putVotes(id, votes) {
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0)
				throw new Error("Invalid id");
			if (isNaN(parseInt(votes))) {
				throw new Error("Invalid votes");
			}

			let results = null;
			try {
				results = await prisma.posts.update({
					where: {
						id: parseInt(id),
					},
					data: {
						votes: parseInt(votes),
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post couldn't be updated");
		} else throw new Error("Post with the given id doesn't exist");
	}

	static async putUrl(id, url) {
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0)
				throw new Error("Invalid id");
			if (!url || url.length > 255 || url.length == 0)
				throw new Error("URL entry too long/empty");

			let results = null;
			try {
				results = await prisma.posts.update({
					where: {
						id: parseInt(id),
					},
					data: {
						url: url,
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post couldn't be updated");
		} else throw new Error("Post with the given id doesn't exist");
	}

	static async delete(id) {
		if (!id) throw new Error("Invalid id entry");
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			let results = null;
			try {
				results = await prisma.posts.delete({
					where: {
						id: parseInt(id),
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post couldn't be deleted");
		} else throw new Error("Post with the given id doesn't exist");

		commentServices.deleteByPost(id);
	}

	static async deleteFile(id) {
		let result = null;
		try {
			result = await prisma.posts.findUnique({
				where: {
					id: parseInt(id),
				},
			});
		} catch (error) {
			throw error;
		} finally {
			await prisma.$disconnect();
		}

		if (result != null) {
			if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0)
				throw new Error("Invalid id");

			let results = null;
			try {
				results = await prisma.posts.update({
					where: {
						id: parseInt(id),
					},
					data: {
						url: null,
					},
				});
			} catch (error) {
				throw error;
			} finally {
				await prisma.$disconnect();
			}

			if (results == null) throw new Error("Post file couldn't be set to null");
		} else throw new Error("Post with the given id doesn't exist");
	}
}

module.exports = PostService;
