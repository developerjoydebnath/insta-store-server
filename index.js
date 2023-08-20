// internal imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// external imports
const config = require('./config/index');
const { credentials } = require('./middlewares/credential');
const { corsOptions } = require('./utils/corsOptions');
const cookieParser = require('cookie-parser');
const { db } = require('./database/db');
const router = require('./routes/index');

//  middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api', router);

// database connection
db();

// server
app.listen(config.port, () => {
    console.log(`server is running at ${config.port}`);
});
