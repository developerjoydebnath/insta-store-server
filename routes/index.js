const router = require('express').Router();
const UserRoute = require('./user.route');

router.use('/user', UserRoute);

module.exports = router;
