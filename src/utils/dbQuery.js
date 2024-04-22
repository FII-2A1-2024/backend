const database = require("./../config/database");

function queryDb(values, sql) {
    return new Promise((resolve, reject) => {
        database.query(sql, values, (err, result) => {
            if (err) {
                console.log("Error at db query: " + err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = queryDb;
