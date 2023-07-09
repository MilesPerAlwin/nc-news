exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "42601") {
        res.status(400).send({ msg: "Bad request."})
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Not found."})
    } else if (err.code === "23502") {
        res.status(400).send({ msg: "Invalid body passed."})
    } else if (err.code === "42703") {
        res.status(400).send({ msg: "Column does not exist."})
    } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg) {
        return res.status(err.status).send({ msg: err.msg });
    }
}