// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle custom errors with statusCode (from services)
  if (err.statusCode) {
    const response = {
      error: err.error
    };
    
    // Add details if provided
    if (err.details) {
      response.details = err.details;
    }
    
    return res.status(err.statusCode).json(response);
  }

  // Handle database duplicate entry errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed'
    });
  }

  // Default 500 error - match brief format exactly
  res.status(500).json({
    error: 'Internal server error'
  });
};

// 404 handler - match brief format exactly
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
};