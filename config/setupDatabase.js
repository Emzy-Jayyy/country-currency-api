const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const setupDatabase = async () => {
    let connection;

    try {
        // Use Railway variables first, fall back to custom env vars
        const config = {
            host: process.env.MYSQLHOST || process.env.DB_HOST,
            port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
            user: process.env.MYSQLUSER || process.env.DB_USER,
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD
        };

        console.log('Attempting to connect to MySQL server...');
        console.log('Host:', config.host);

        connection = await mysql.createConnection(config);
        console.log('✅ CONNECTED TO MySQL server');

        // Get database name
        const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway';

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database "${dbName}" ensured`);

        await connection.query(`USE \`${dbName}\``);

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
        console.log('✅ Countries table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_settings (
                key_name VARCHAR(255) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ App settings table created');

        await connection.query(`
            INSERT INTO app_settings (key_name, value)
            VALUES ('last_refreshed_at', NULL)
            ON DUPLICATE KEY UPDATE key_name = key_name
        `);
        console.log('✅ App settings initialized');

        console.log('\n🎉 Database setup completed successfully!\n');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit(0);
    }
};

setupDatabase();