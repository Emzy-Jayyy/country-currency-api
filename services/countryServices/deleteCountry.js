const { deleteCountryByName } = require('../../models/countryModel');

module.exports.deleteCountry = async (name) => {
    const deleted = await deleteCountryByName(name);
    if (!deleted) {
        throw {
            statusCode: 404,
            error: 'Country not found'
        };
    }
    return { message: 'Country deleted successfully' };
}