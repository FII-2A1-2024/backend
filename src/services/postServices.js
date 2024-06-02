const post = require("./../models/postModel");
const fakePost = require("./../models/fakePostModels");
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
			let user = null;
			try {
				user = await prisma.user.findUnique({
					where: {
						uid: parseInt(result.author_id),
					},
				});
			} catch (error) {
				await prisma.$disconnect();
			} finally {
				await prisma.$disconnect();
			}

			let is_teacher = false;
			if(user != null && parseInt(user.profesorFlag) == 1)
				is_teacher = true;

			const createdAtDate = new Date(result.created_at);
			const createdAtString = createdAtDate.toISOString();
			const receivedPost = new fakePost(
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
				is_teacher
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
			const receivedPosts = await Promise.all(results.map(async (result) => {
				let user = null;
				try {
					user = await prisma.user.findUnique({
						where: {
							uid: parseInt(result.author_id),
						},
					});
				} catch (error) {
					await prisma.$disconnect();
				} finally {
					await prisma.$disconnect();
				}
	
				let is_teacher = false;
				if (user != null && parseInt(user.profesorFlag) == 1)
					is_teacher = true;
	
				const createdAtDate = new Date(result.created_at);
				const createdAtString = createdAtDate.toISOString();
				const receivedPost = new fakePost(
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
					is_teacher
				);
	
				return receivedPost;
			}));
			
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
		category,
		url
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

		if (parseInt(uid) !== parseInt(author_id)) {
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

		let results = null;
		try {
			results = await prisma.posts.create({
				data: {
					author_id: parseInt(author_id),
					username: username,
					title: title,
					description: description,
					votes: 0,
					created_at: createdAt,
					category: category,
					comments_count: 0,
					url: url
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
			votes: 0,
			created_at: createdAt,
			category: category,
			comments_count: 0,
			url: url
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

	static async putVotes(
        user_id,
        id,
        votes
    ) {
        let result = null;
        try {
            result = await prisma.posts.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (result != null){
            if(!id || isNaN(parseInt(id)) || parseInt(id) <= 0)  
                throw new Error("Invalid id");
            if (isNaN(parseInt(votes))) {
                throw new Error("Invalid votes");
            }

            //verificam daca exista in postsVotes
            let resultVote = null;
            try {
                resultVote = await prisma.postsVotes.findMany({
                    where: {
                        user_id: parseInt(user_id),
                        post_id: parseInt(result.id)
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            let difference = votes - result.votes;
            if(difference == 2 && resultVote[0] != null) { //inseamna ca user-ul a sters dislike-ul si a dat like si nu mai facuse deja asta
                if(resultVote[0].vote ==-1){

                    //trebuie update pe campul de vote in valoarea opusa
                    let results = null;
                    try {
                        results = await prisma.postsVotes.updateMany({
                            where: {
                                user_id: parseInt(user_id),
                                post_id: parseInt(result.id)
                            },
                            data: {
                                vote: 1
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                    if (results == null) 
                        throw new Error("PostsVotes couldn't be updated");
                }
                else throw new Error("Invalid vote entry - a like was already made");
                
            }  
            else if(difference == -2 && resultVote[0] != null){ //inseamna ca user-ul a sters like-ul si a dat dislike si nu mai facuse deja asta
                //trebuie update pe campul de vote in valoarea opusa
                if(resultVote[0].vote ==1){
                    let results = null;
                    try {
                        results = await prisma.postsVotes.updateMany({
                            where: {
                                user_id: parseInt(user_id),
                                post_id: parseInt(result.id)
                            },
                            data: {
                                vote: -1
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                    if (results == null) 
                        throw new Error("PostsVotes couldn't be updated");
                }
                else throw new Error("Invalid vote entry - a dislike was already made");
                      
            }  
            else if(difference == 1 || difference == -1) { //inseamna ca user-ul a dat dis/like sau si-a sters dis/like-ul

                if(resultVote[0] == null) { //daca nu exista deja in tabel, a dat dis/like, trebuie facut insert 

                    let results = null;
                    try {
                        results = await prisma.postsVotes.create({
                            data: {
                                user_id: parseInt(user_id),
                                post_id: parseInt(result.id),
                                vote: difference
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                    if (results == null) 
                        throw new Error("PostsVotes couldn't be updated");
                }
                else if( (difference == 1 && resultVote[0].vote == 1) || (difference == -1 && resultVote[0].vote == -1) ){ //vrea sa dea iar dis/like dar a dat deja
                    throw new Error("A like/dislike was already made by this user");
                } 
                else { 
                    //exista in tabel -> doar si a sters like-ul 
                    //facem delete din postsVotes
                    let deleteRow = null;
                    try {
                        deleteRow = await prisma.postsVotes.deleteMany({
                            where: {
                                user_id: parseInt(user_id),
                                post_id: parseInt(result.id),
                            }
                        });
                    } catch (error) {
                        throw error;
                    } finally {
                        await prisma.$disconnect();
                    }
                }

            }
            else throw new Error("Invalid vote entry - cannot deduce user behaviour");

            let results = null;
            try {
                results = await prisma.posts.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        votes: parseInt(votes)
                    }
                });
            } catch (error) {
                throw error;
            } finally {
                await prisma.$disconnect();
            }

            if (results == null) 
                throw new Error("Post couldn't be updated");
        }
        else throw new Error("Post with the given id doesn't exist");
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
