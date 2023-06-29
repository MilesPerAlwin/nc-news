const { selectArticleById, selectArticles, selectCommentsById, checkArticleExists } = require("../models/articles-model");

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

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [selectCommentsById(article_id)];

    if (article_id) {
        promises.push(checkArticleExists(article_id));
    }

    Promise.all(promises)
    .then((promiseResults) => {
        res.status(200).send({ comments: promiseResults[0] });
    })
    .catch((err) => {
        next(err);
    })
}