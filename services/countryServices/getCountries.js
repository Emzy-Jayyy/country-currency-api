const { getAllCountries } = require('../../models/countryModel');

module.exports.getCountries = async (filters) => {
    return await getAllCountries(filters)
}