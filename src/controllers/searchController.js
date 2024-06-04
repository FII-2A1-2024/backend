const SearchServices = require("../services/searchServices");

async function search(req, res) {
	if (req.query.category === "All" || req.query.category === undefined) {
		SearchServices.getAll(req, res);
	} else {
		SearchServices.getByCategory(req, res);
	}
}

module.exports = search;
