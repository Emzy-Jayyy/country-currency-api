const { getAllCountries } = require('../../models/countryModel');

const getCountries = async (filters) => {
    return await getAllCountries(filters);
}

module.exports = getCountries;