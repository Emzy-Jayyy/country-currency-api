const processCountryData = (country, exchangeRates, timestamp) => {
    const name = country.name;
    const capital = country.capital || null;
    const region = country.region || null;
    const population = country.population;
    const flag_url = country.flag || null;

    let currency_code = null;
    let exchange_rate = null;
    let estimated_gdp = null;

    if (country.currencies && country.currencies.length > 0) {
        currency_code = country.currencies[0].code;

        if (exchangeRates[currency_code]) {
            exchange_rate = parseFloat(exchangeRates[currency_code]);

            const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
            estimated_gdp = (population * randomMultiplier) / exchange_rate;
        }
    } else {
        estimated_gdp = 0
    }

    return {
        name,
        capital,
        region,
        population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url,
        last_refreshed_at: timestamp
    };
}

module.exports = processCountryData;