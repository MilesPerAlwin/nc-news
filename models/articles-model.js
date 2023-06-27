const db = require("../db/connection");

exports.selectArticleById = (req, res) => {
    return db.query(
        `SELECT * from articles 
        WHERE article_id = $1`, [req])
    .then(({ rows }) => {
        return rows;
    })
}