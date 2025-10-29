// const { fetchCountries, fetchExchangeRates } = require('../services/externalApi');
const refreshCountries = require('../services/countryServices/refreshCountries');
const getCountries = require('../services/countryServices/getCountries');
const getACountryByName = require('../services/countryServices/getCountryByName');
const deleteCountry = require('../services/countryServices/deleteCountry');
const getStatus = require('../services/countryServices/getStatus');
const { getImagePath, imageExists } = require('../services/imageService')

module.exports.refreshCountries = async (req, res, next) => {
    try {
        const result = await refreshCountries();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports.getCountries = async (req, res, next) => {
    try {
        const filters = {
            region: req.query.region,
            currency: req.query.currency,
            sort: req.query.sort
        };

        const countries = await getCountries(filters);
        res.status(200).json(countries);
    } catch (error) {
        next(error);
    }
}

module.exports.getCountryByName = async (req, res, next) => {
    try {
        const country = await getACountryByName(req.params.name);

        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            })
        }

        res.status(200).json(country);
    } catch (error) {
        next(error);
    }
}

module.exports.deleteCountry = async (req, res, next) => {
    try {
        const result = await deleteCountry(req.params.name);
        if (!result) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }
        res.status(200).json({
            message: 'Country deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

module.exports.getStatus = async (req, res, next) => {
    try {
        const status = await getStatus();
        res.status(200).json(status);
    } catch (error) {
        next(error)
    }
}

module.exports.getImage = async (req, res, next) => {
    try {
        // if (!imageExists()) {
        //     console.log('Image not found, generating...');
        //     await generateSummaryImageHelper();
        // }

        if (!imageExists()) {
            return res.status(404).json({
                error: 'Summary image not found'
            });
        }

        const imagePath = getImagePath();
        res.sendFile(imagePath)
    } catch (error) {
        next(error);
    }
}