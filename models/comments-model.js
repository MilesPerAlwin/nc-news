const db = require("../db/connection");

exports.deleteComment = (req, res) => {

    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1`, [req])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Not found." });
            }
        })
}