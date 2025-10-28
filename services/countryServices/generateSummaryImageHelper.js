const { getLastRefreshed, getTopCountriesByGDP, getTotalCount } = require('../../models/countryModel');
const { generateSummaryImage } = require('../../services/imageService')

module.exports.generateSummaryImageHelper = async () => {
    try {
        const totalCountries = await getTotalCount();
        const topCountries = await getTopCountriesByGDP(5);
        const lastRefreshed = await getLastRefreshed();

        await generateSummaryImage({
            totalCountries,
            topCountries,
            lastRefreshed
        });

        console.log('Summary image generated successfully')
    } catch (error) {
        console.error('Failed to generate summary image:', error.message);
    }
}