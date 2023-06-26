const { selectTopics } = require("../models/model")

exports.getTopics = (req, res) => {
    selectTopics()
    .then((topicsArr) => {
        res.status(200).send({ topics: topicsArr });
    })
}