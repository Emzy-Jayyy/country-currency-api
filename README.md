# Country Currency & Exchange API

A RESTful API that fetches country data from external APIs, enriches it with currency exchange rates, calculates estimated GDP, and provides comprehensive CRUD operations with data visualization.

## 🚀 Features

- Fetch and cache country data from RestCountries API
- Integrate real-time exchange rates
- Calculate estimated GDP for each country
- Filter and sort countries by region, currency, and GDP
- Generate visual summary images
- Full CRUD operations
- MySQL database persistence
- Comprehensive error handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd country-currency-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=country_currency_db

COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD

API_TIMEOUT=10000
```

### 4. Set up the database

```bash
npm run setup-db
```

This will:
- Create the database if it doesn't exist
- Create the `countries` table
- Create the `app_settings` table
- Initialize default settings

### 5. Start the server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your specified PORT).

## 📚 API Endpoints

### 1. Refresh Countries Data

**Endpoint:** `POST /countries/refresh`

Fetches country data and exchange rates from external APIs, processes them, and stores in the database.

**Response:**
```json
{
  "message": "Countries refreshed successfully",
  "total_processed": 250,
  "timestamp": "2025-10-25T18:00:00.000Z"
}
```

**Error Response (503):**
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from RestCountries API"
}
```

---

### 2. Get All Countries

**Endpoint:** `GET /countries`

Retrieve all countries with optional filtering and sorting.

**Query Parameters:**
- `region` - Filter by region (e.g., `Africa`, `Europe`)
- `currency` - Filter by currency code (e.g., `NGN`, `USD`)
- `sort` - Sort by GDP (`gdp_asc` or `gdp_desc`)

**Examples:**

```bash
# Get all countries
GET /countries

# Filter by region
GET /countries?region=Africa

# Filter by currency
GET /countries?currency=NGN

# Sort by GDP (descending)
GET /countries?sort=gdp_desc

# Combine filters
GET /countries?region=Africa&sort=gdp_desc
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-25T18:00:00Z"
  }
]
```

---

### 3. Get Single Country

**Endpoint:** `GET /countries/:name`

Retrieve a specific country by name (case-insensitive).

**Example:**
```bash
GET /countries/Nigeria
```

**Response:**
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-25T18:00:00Z"
}
```

**Error Response (404):**
```json
{
  "error": "Country not found"
}
```

---

### 4. Delete Country

**Endpoint:** `DELETE /countries/:name`

Delete a country record from the database.

**Example:**
```bash
DELETE /countries/Nigeria
```

**Response:**
```json
{
  "message": "Country deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Country not found"
}
```

---

### 5. Get Status

**Endpoint:** `GET /status`

Get the total number of countries and the last refresh timestamp.

**Response:**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-25T18:00:00Z"
}
```

---

### 6. Get Summary Image

**Endpoint:** `GET /countries/image`

Retrieve the generated summary image showing:
- Total countries
- Top 5 countries by GDP
- Last refresh timestamp

**Response:** PNG image file

**Error Response (404):**
```json
{
  "error": "Summary image not found"
}
```

---

## 🗄️ Database Schema

### Countries Table

```sql
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  capital VARCHAR(255),
  region VARCHAR(100),
  population BIGINT NOT NULL,
  currency_code VARCHAR(10),
  exchange_rate DECIMAL(15, 6),
  estimated_gdp DECIMAL(20, 2),
  flag_url TEXT,
  last_refreshed_at TIMESTAMP,
  INDEX idx_region (region),
  INDEX idx_currency (currency_code),
  INDEX idx_gdp (estimated_gdp)
);
```

### App Settings Table

```sql
CREATE TABLE app_settings (
  key_name VARCHAR(50) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP
);
```

---

## 🔧 Project Structure

```
country-currency-api/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── setupDatabase.js     # Database setup script
│   ├── controllers/
│   │   └── countryController.js # Route handlers
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling
│   │   └── validators.js        # Input validation
│   ├── models/
│   │   └── countryModel.js      # Database operations
│   ├── routes/
│   │   └── countryRoutes.js     # API routes
│   ├── services/
│   │   ├── countryService.js    # Business logic
│   │   ├── externalApiService.js # External API calls
│   │   └── imageService.js      # Image generation
│   └── index.js                 # Application entry point
├── cache/                       # Generated images
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

---

## 🧪 Testing the API

### Using curl

```bash
# Refresh countries
curl -X POST http://localhost:3000/countries/refresh

# Get all countries
curl http://localhost:3000/countries

# Filter by region
curl "http://localhost:3000/countries?region=Africa"

# Get single country
curl http://localhost:3000/countries/Nigeria

# Get status
curl http://localhost:3000/status

# Download image
curl http://localhost:3000/countries/image --output summary.png

# Delete country
curl -X DELETE http://localhost:3000/countries/Nigeria
```

### Using Postman or Thunder Client

Import the following collection or create requests manually:

1. **POST** `http://localhost:3000/countries/refresh`
2. **GET** `http://localhost:3000/countries`
3. **GET** `http://localhost:3000/countries?region=Africa&sort=gdp_desc`
4. **GET** `http://localhost:3000/countries/Nigeria`
5. **DELETE** `http://localhost:3000/countries/Nigeria`
6. **GET** `http://localhost:3000/status`
7. **GET** `http://localhost:3000/countries/image`

---

## 🚀 Deployment

### Railway Deployment

1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
3. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```
4. Add MySQL database in Railway dashboard
5. Set environment variables in Railway dashboard
6. Run database setup:
   ```bash
   railway run npm run setup-db
   ```

### Heroku Deployment

1. Create a Heroku account and install Heroku CLI
2. Create new app:
   ```bash
   heroku create your-app-name
   ```
3. Add MySQL addon:
   ```bash
   heroku addons:create jawsdb:kitefin
   ```
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```
6. Run setup:
   ```bash
   heroku run npm run setup-db
   ```

---

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL database driver
- **dotenv** - Environment variable management
- **axios** - HTTP client for external APIs
- **canvas** - Image generation
- **cors** - CORS middleware

### Dev Dependencies

- **nodemon** - Development auto-reload

---

## ⚠️ Error Handling

The API returns consistent JSON error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```

### 404 Not Found
```json
{
  "error": "Country not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

### 503 Service Unavailable
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from RestCountries API"
}
```

---

## 🔍 Business Logic Details

### Currency Handling

1. **Multiple currencies**: Only the first currency is stored
2. **No currencies**: `currency_code`, `exchange_rate` set to `null`, `estimated_gdp` set to `0`
3. **Currency not in exchange API**: `exchange_rate` and `estimated_gdp` set to `null`

### GDP Calculation

```javascript
estimated_gdp = population × random(1000–2000) ÷ exchange_rate
```

The random multiplier is regenerated on each refresh.

### Update vs Insert

Countries are matched by name (case-insensitive). If a country exists, all fields are updated including recalculating GDP with a fresh random multiplier.

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | `country_currency_db` |
| `COUNTRIES_API_URL` | RestCountries API | See .env.example |
| `EXCHANGE_RATE_API_URL` | Exchange Rate API | See .env.example |
| `API_TIMEOUT` | API timeout (ms) | `10000` |

---

## 🐛 Troubleshooting

### Database Connection Failed

- Check MySQL is running: `mysql --version`
- Verify credentials in `.env`
- Ensure database exists or run `npm run setup-db`

### External API Errors

- Check internet connection
- Verify API URLs are accessible
- Check if APIs have rate limits

### Image Generation Failed

- Ensure `canvas` package is properly installed
- Check write permissions for `cache/` directory
- Verify sufficient disk space

### Port Already in Use

- Change `PORT` in `.env` file
- Or kill process: `lsof -ti:3000 | xargs kill` (Mac/Linux)

---

## 👨‍💻 Author

Your Name - your.email@example.com

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [RestCountries API](https://restcountries.com/)
- [Open Exchange Rates API](https://open.er-api.com/)
- Stage 2 Backend Task - HNG Internship

---

**Good luck with your submission! 🚀**