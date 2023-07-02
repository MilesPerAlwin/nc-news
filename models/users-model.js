const db = require("../db/connection");

exports.selectUsers = (req, res) => {
    return db.query(
        `SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        })
}