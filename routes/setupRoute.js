const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.get('/setup-database-temp', async (req, res) => {
    let connection;

    try {
        // Use Railway's environment variables directly
        const config = {
            host: process.env.MYSQLHOST || process.env.DB_HOST,
            port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
            user: process.env.MYSQLUSER || process.env.DB_USER,
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD
        };

        console.log('🔌 Attempting to connect to MySQL...');
        console.log('📍 Host:', config.host);

        // Connect without database first
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to MySQL server');

        // Get database name
        const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway';
        console.log('📦 Database name:', dbName);

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log('✅ Database created/verified');

        // Use database
        await connection.query(`USE \`${dbName}\``);

        // Create countries table
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

        // Create app_settings table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key_name VARCHAR(255) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('✅ App_settings table created');

        // Initialize settings
        await connection.query(`
      INSERT INTO app_settings (key_name, value) 
      VALUES ('last_refreshed_at', NULL) 
      ON DUPLICATE KEY UPDATE key_name = key_name
    `);
        console.log('✅ App settings initialized');

        await connection.end();

        // Success response
        res.json({
            success: true,
            message: '🎉 Database setup completed successfully!',
            database: dbName,
            tables_created: ['countries', 'app_settings'],
            host: config.host
        });

    } catch (error) {
        console.error('❌ Setup failed:', error);

        if (connection) {
            try {
                await connection.end();
            } catch (e) {
                // Ignore connection close errors
            }
        }

        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code,
            sqlState: error.sqlState
        });
    }
});

module.exports = router;