// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal server error',
    });
};

module.exports = errorHandler;
