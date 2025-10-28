const express = require('express');
const { deleteCountry, getCountries, getCountryByName, getImage, refreshCountries } = require('../controllers/countryController');

const router = express.Router();

router.post('/refresh', refreshCountries);

router.get('/image', getImage);

router.get('/', getCountries);

router.get('/:name', getCountryByName);

router.delete('/:name', deleteCountry);

module.exports = router;