const config = require('../config/index');

// const corsOptions = (callback) => {
//   origin: {
//     const allowedOrigins = config.CLIENT_ORIGIN.split(',');
//     const host = req.headers.host;
//     console.log({ host });
//     if (allowedOrigins.includes(host)) {
//       callback(null, true);
//     } else {
//       callback(new Error('not allowed by cors policy'));
//     }
//   }
// };

const corsOptions = {
    origin: (origin, callback) => {
        const listedOrigins = config.ORIGIN.split(',');
        if (listedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200,
};

module.exports = { corsOptions };
