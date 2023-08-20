const _ = require('lodash');
const { devConfig } = require('./devConfig');
const { prodConfig } = require('./prodConfig');

const env = process.env.NODE_ENV || 'development';

let config = {};

const defaultConfig = {
    port: process.env.PORT,
};

if (env === 'development') {
    config = { ...devConfig };
} else if (env === 'production') {
    config = { ...prodConfig };
}

module.exports = _.merge(config, defaultConfig);
