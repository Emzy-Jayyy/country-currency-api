// Global error handler
module.exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle custom errors with statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.error || 'An error occurred',
      details: err.details
    });
  }

  // Handle database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: 'A country with this name already exists'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
    });
  }

  // Default 500 error
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};

// 404 handler
module.exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    details: `Cannot ${req.method} ${req.path}`
  });
};