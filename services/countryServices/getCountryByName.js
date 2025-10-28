const { getCountryByName } = require('../../models/countryModel');

module.exports.getCountryByName = async (name) => {
    return await getCountryByName(name)
}