const jwt = require('jsonwebtoken');
const config = require('../config/index');

// generate access token
const accessTokenGenerator = (payload) => {
    return Promise.resolve(jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '15m' }));
};

// generate btn disabled token
const btnControllerTokenGenerator = (payload) => {
    return Promise.resolve(jwt.sign(payload, process.env.BTN_CONTROLLER_SECRET_KEY, { expiresIn: '2m' }));
};

// * Verify Access token
const accessTokenValidator = async (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, config.JWT_ACCESS_SECRET, (error, decoded) => {
            if (error) return resolve(false);
            resolve(decoded);
        });
    });
};

// * Verify btn controller token
const btnControllerTokenValidator = async (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, process.env.BTN_CONTROLLER_SECRET_KEY, (error, decoded) => {
            if (error) return resolve(false);
            resolve(decoded);
        });
    });
};

// generate refresh token
const refreshTokenGenerator = (payload) => {
    return Promise.resolve(jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '1d' }));
};

// * Verify Access token
const refreshTokenValidator = async (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, config.JWT_REFRESH_SECRET, (error, decoded) => {
            if (error) return resolve(false);
            resolve(decoded);
        });
    });
};

module.exports = {
    accessTokenGenerator,
    refreshTokenGenerator,
    accessTokenValidator,
    refreshTokenValidator,
    btnControllerTokenGenerator,
    btnControllerTokenValidator,
};
