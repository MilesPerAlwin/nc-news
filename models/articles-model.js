const db = require("../db/connection");

exports.selectArticleById = (req, res) => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT as comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id=$1
        GROUP BY articles.article_id`, [req])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found."})
        }
        return rows[0];
    })
}

exports.selectArticles = (req, res) => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT as comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.selectCommentsById = (req, res) => {
    return db.query(
        `SELECT * FROM comments 
        WHERE article_id = $1`, [req])
        .then(({ rows }) => {
            return rows;
        })
}

exports.insertComments = (req, article_id) => {
    
    const parsedArticleId = parseInt(article_id)

    const { username, body } = req;
    return db.query(
        `INSERT INTO comments (article_id, body, author) 
        VALUES ($1, $2, $3)
        RETURNING *`, [parsedArticleId, body, username]
        )
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.checkArticleExists = (article_id) => {
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found."})
            }
        })
}

exports.updateArticleVotes = (req, article_id) => {

    if (!req.inc_votes && req.inc_votes !== 0) {
        return Promise.reject({ status: 400, msg: "Invalid body passed."})
    }

    return db.query(
        `UPDATE articles
        SET votes = GREATEST(0, ((SELECT votes FROM articles WHERE article_id = $1) + $2))
        WHERE article_id = $1
        RETURNING *`, [article_id, req.inc_votes])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found."})
            }
            return rows[0];
        })

}