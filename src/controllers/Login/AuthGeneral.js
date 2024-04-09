// TO DO: Manage exceptions acordingly

const mysql = require("mysql");

function establishConnection() {
	const connection = mysql.createConnection({
		host: "152.53.32.81",
		user: "dev",
		password: "pXkZkGCsxdaHsr6",
		database: "development",
	});
	return connection;
}
function canUserLogin(email, password, connection) {
	connection.connect((err) => {
		if (err) throw err;
		connection.query(
			`SELECT verifiedEmail FROM User WHERE password LIKE '${password}' AND emailPrimary LIKE '${email}'`,
			(err, result) => {
				if (err) throw err;
				let verified = 0;
				if (result[0].verifiedEmail === 1) {
					console.log("User verified");
					verified = 1;
				} else {
					console.log("User unverifeid");
				}
				connection.end();
				return verified;
			},
		);
	});
}
