const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_TIMEOUT = parseInt(process.env.API_TIMEOUT) || 10000;

module.exports.fetchCountries = async () => {
    try {
        const response = await axios.get(process.env.COUNTRIES_API_URL, {
            timeout: API_TIMEOUT
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Countires API request timed out');
        }
        throw new Error(`Failed to fetch countries: ${error.message}`)
    }
}

module.exports.fetchExchangeRates = async () => {
    try {
        const response = await axios.get(process.env.EXCHANGE_RATE_API_URL, {
            timeout: API_TIMEOUT
        });
        return response.data.rates;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Exchange Rate API request timed out');
        }
        throw new Error(`Failed to fetch exchange rates: ${error.message}`)
    }
}