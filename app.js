const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);


app.all(`/*`, (req, res) => {
    res.status(404).send({ msg: "Path not found."})
});



module.exports = app;