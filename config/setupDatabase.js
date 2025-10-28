const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const setupDatabase = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('CONNECTED TO MySQL server');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database "${process.env.DB_NAME}" ensured`);

        await connection.query(`USE \`${process.env.DB_NAME}\``);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS countries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                capital VARCHAR(255),
                region VARCHAR(100),
                population BIGINT NOT NULL,
                currency_code VARCHAR(10),
                exchange_rate DECIMAL(15, 6),
                estimated_gdp DECIMAL(20, 2),
                flag_url TEXT,
                last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_region (region),
                INDEX idx_currency (currency_code),
                INDEX idx_gdp (estimated_gdp)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Countries table created');

        // FIXED: Removed trailing comma after updated_at
        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_settings (
                key_name VARCHAR(255) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            INSERT INTO app_settings (key_name, value)
            VALUES ('last_refreshed_at', NULL)
            ON DUPLICATE KEY UPDATE key_name = key_name
        `);
        console.log('App settings table created');
        console.log('\nDatabase setup completed successfully');

    } catch (error) {
        console.error('Error setting up database:', error);
        throw error; // Re-throw to see the actual error
    } finally {
        if (connection) {
            await connection.end();
        }

        process.exit(0);
    }
}

setupDatabase();