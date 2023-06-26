const db = require("./db/connection");

exports.selectTopics = (req, res) => {
    return db.query(`SELECT * from topics`)
    .then(({ rows }) => {
        return rows;
    })
}