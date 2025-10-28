const pool = require('../config/database');

module.exports.upsertCountry = async (countryData) => {
    const {
        name,
        capital,
        region,
        population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url,
        last_refreshed_at
    } = countryData;

    const query = `
        INSERT INTO countries (
            name,
            capital,
            region,
            population,
            currency_code,
            exchange_rate,
            estimated_gdp,
            flag_url,
            last_refreshed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            capital = VALUES(capital),
            region = VALUES(region),
            population = VALUES(population),
            currency_code = VALUES(currency_code),
            exchange_rate = VALUES(exchange_rate),
            estimated_gdp = VALUES(estimated_gdp),
            flag_url = VALUES(flag_url),
            last_refreshed_at = VALUES(last_refreshed_at)
    `;

    const values = [
        name,
        capital,
        region,
        population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url,
        last_refreshed_at
    ];

    const [result] = await pool.execute(query, values);
    return result;
}

module.exports.getAllCountries = async (filters = {}) => {
    let query = 'SELECT * FROM countries WHERE 1=1';
    const params = [];

    if (filters.region) {
        query += ' AND region = ?';
        params.push(filters.region);
    }

    if (filters.currency) {
        query += ' AND currency_code = ?';
        params.push(filters.currency);
    }

    if (filters.sort) {
        if (filters.sort === 'gdp_desc') {
            query += ' ORDER BY estimated_gdp DESC';
        } else if (filters.sort === 'gdp_asc') {
            query += ' ORDER BY estimated_gdp ASC';
        }
    }

    const [rows] = await pool.execute(query, params);
    return rows;
}

module.exports.getCountryByName = async (name) => {
    const query = 'SELECT * countries WHERE LOWER(name) = LOWER(?)';
    const [rows] = await pool.execute(query, [name]);
    return rows[0] || null;
}

module.exports.deleteCountryByName = async (name) => {
    const query = 'DELETE FROM countries WHERE LOWER(name) = LOWER(?)';
    const [result] = await pool.execute(query, [name]);
    return result.affectedRows > 0;
}

module.exports.getTotalCount = async () => {
    const query = 'SELECT COUNT(*) as total FROM countries';
    const [rows] = await pool.execute(query);
    return rows[0].total;
};

module.exports.getTopCountriesByGDP = async (limit = 5) => {
    const query = `
    SELECT name, estimated_gdp 
    FROM countries 
    WHERE estimated_gdp IS NOT NULL
    ORDER BY estimated_gdp DESC 
    LIMIT ?
  `;
    const [rows] = await pool.execute(query, [limit]);
    return rows;
};

module.exports.updateLastRefreshed = async (timestamp) => {
    const query = `
    INSERT INTO app_settings (key_name, value) 
    VALUES ('last_refreshed_at', ?) 
    ON DUPLICATE KEY UPDATE value = ?, updated_at = CURRENT_TIMESTAMP
  `;
    await pool.execute(query, [timestamp, timestamp]);
};

module.exports.getLastRefreshed = async () => {
    const query = 'SELECT value FROM app_settings WHERE key_name = ?';
    const [rows] = await pool.execute(query, ['last_refreshed_at']);
    return rows[0]?.value || null;
};
