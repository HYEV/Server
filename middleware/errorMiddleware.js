const errorHandler = (err, req, res ,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    const NODE_ENV = 'production'
    res.json({
        message: err.message,
        stack: NODE_ENV === 'production' ? null : err.stack
    })
    next()
}

module.exports = {
    errorHandler
}