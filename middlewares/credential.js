const config = require('../config/index');

// const credentials = (req, res, next) => {
//   const allowedOrigin = config.CLIENT_ORIGIN.split(',');
//   console.log(allowedOrigin);
//   const origin = req.headers.host;
//   console.log(req.headers);
//   if (allowedOrigin.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//   }
//   next();
// };

const credentials = (req, res, next) => {
    const listedOrigins = config.ORIGIN.split(',');
    const origin = req.headers.origin;
    if (listedOrigins.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
};
module.exports = { credentials };
