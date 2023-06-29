const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const { getArticleById, getArticles, postComments } = require("./controllers/articles-controller");
const { handlePsqlErrors, handleCustomErrors } = require("./error-handling");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.post("/api/articles/:article_id/comments", postComments);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

app.all(`/*`, (req, res) => {
    res.status(404).send({ msg: "Path not found."})
});



module.exports = app;