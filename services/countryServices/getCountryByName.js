const { getCountryByName } = require('../../models/countryModel');

const getACountryByName = async (name) => {
    return await getCountryByName(name);
}

module.exports = getACountryByName;