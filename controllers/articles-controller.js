const { selectArticleById, selectArticles, insertComments } = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articlesArr) => {
        res.status(200).send({ articles: articlesArr });
    })
}

exports.postComments = (req, res) => {
    console.log(req.params, req.body)
    insertComments(req.body, req.params);
}
