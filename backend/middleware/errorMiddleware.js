const errorHandler = (err, req, res, next) => {
  // Log the full error internally on the server
  console.error("❌ Server Error:", err.stack || err.message);

  // Determine status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Return a generic message to the client (no stack traces or raw errors)
  res.status(statusCode).json({
    message: 'An internal server error occurred. Please try again later.',
    // Only show detailed errors in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, details: err.message })
  });
};

module.exports = { errorHandler };