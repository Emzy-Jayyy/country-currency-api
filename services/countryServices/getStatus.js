const { getTotalCount, getLastRefreshed } = require('../../models/countryModel');

module.exports.getStatus = async () => {
    const total_countries = await getTotalCount();
    const last_refreshed_at = await getLastRefreshed();

    return {
        total_countries,
        last_refreshed_at
    };
};

