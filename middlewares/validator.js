// Validation middleware
module.exports.validateCountryData = (req, res, next) => {
  const { name, population, currency_code } = req.body;
  const errors = {};

  if (!name || name.trim() === '') {
    errors.name = 'is required';
  }

  if (!population || isNaN(population) || population < 0) {
    errors.population = 'is required and must be a positive number';
  }

  // Note: currency_code can be null for countries without currencies
  // but if provided, it should be valid
  if (currency_code !== undefined && currency_code !== null && currency_code.trim() === '') {
    errors.currency_code = 'must not be empty if provided';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate query parameters
module.exports.validateQueryParams = (req, res, next) => {
  const { sort } = req.query;

  if (sort && !['gdp_asc', 'gdp_desc'].includes(sort)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: {
        sort: 'must be either gdp_asc or gdp_desc'
      }
    });
  }

  next();
};