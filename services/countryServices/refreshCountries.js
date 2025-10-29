const { upsertCountry, updateLastRefreshed } = require('../../models/countryModel');
const { fetchCountries, fetchExchangeRates } = require('../../services/externalApi');
const generateSummaryImageHelper = require('./generateSummaryImageHelper')
const processCountryData = require('./processCountryData')

const refreshCountries = async () => {
    // const [countries, exchangeRates] = await Promise.all([
    //     fetchCountries(),
    //     fetchExchangeRates()
    // ]);

    let countries, exchangeRates;

    try {
        countries = await fetchCountries();
    } catch (error) {
        throw {
            statusCode: 503,
            error: 'External data source unavailable',
            details: 'Could not fetch data from RestCountries API'
        };
    }

    try {
        exchangeRates = await fetchExchangeRates();
    } catch (error) {
        throw {
            statusCode: 503,
            error: 'External data source unavailable',
            details: 'Could not fetch data from Exchange Rate API'
        };
    }

    try {

        const currentTimestamp = new Date();
        const processedCountry = { inserted: 0, updated: 0, total: 0 };

        for (const country of countries) {
            try {
                const countryData = processCountryData(country, exchangeRates, currentTimestamp);

                await upsertCountry(countryData);
                processedCountry.total += 1;
            } catch (error) {
                console.error(`Error processing ${country.name.common}:`, error.message);
            }
        }

        await updateLastRefreshed(currentTimestamp);

        await generateSummaryImageHelper();

        return {
            message: 'Countries refreshed successfully',
            total_processed: processedCountry.total,
            timestamp: currentTimestamp.toISOString()
        };

    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('timed out')) {
            const apiName = error.message.includes('countries') ? 'RestCountries API' : 'Exchange Rate API';
            throw {
                statusCode: 503,
                error: 'External data source unavailable',
                details: `Could not fetch data from ${apiName}`
            };
        }
        throw error;
    }
};

module.exports = refreshCountries;