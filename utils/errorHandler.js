const errorHandler = (err, req, res) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ error: err.message });
};

module.exports = errorHandler;
