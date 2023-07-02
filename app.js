const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const { getArticleById, getArticles, getCommentsById, postComments, patchArticleVotes } = require("./controllers/articles-controller");
const { handlePsqlErrors, handleCustomErrors } = require("./error-handling");
const { removeComment } = require("./controllers/comments-controller");
const { getUsers } = require("./controllers/users-controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", removeComment)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

app.all(`/*`, (req, res) => {
    res.status(404).send({ msg: "Path not found."})
});



module.exports = app;