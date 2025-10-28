const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const countryRoutes = require('./routes/countryRoute.js');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler.js')
const { getStatus } = require('./controllers/countryController');
const { pool } = require('./config/database.js');

pool

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.json({
        message: 'Country Currency & Exchange API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            refresh: 'POST /countries/refresh',
            getAll: 'GET /countries',
            getOne: 'GET /countries/:name',
            delete: 'DELETE /countries/:name',
            status: 'GET /status',
            image: 'GET /countries/image'
        }
    });
});

app.get('/status', getStatus);

app.use('/countries', countryRoutes);

app.use(notFoundHandler); 
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})