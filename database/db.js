const mongoose = require('mongoose');
const config = require('../config/index');

const url = config.DB_CONNECTION_STRING;

const db = async () => {
    return await mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Connected to database'))
        .catch((err) => console.log(err));
};

module.exports = { db };
