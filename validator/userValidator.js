const { check, validationResult } = require('express-validator');
const User = require('../models/user.model');

const addUserValidator = [
    check('username')
        .isLength({ min: 1 })
        .withMessage('Username is required!')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Username must contain alpha characters!')
        .isLowercase()
        .withMessage('Username must be lowercase!')
        .trim(),

    check('email').isEmail().withMessage('Invalid email address!').trim(),

    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol',
        ),
];

const addUserValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // response the errors
        res.status(500).json({
            error: mappedErrors,
            message: 'Please fill all requirements!',
        });
    }
};

module.exports = {
    addUserValidator,
    addUserValidationHandler,
};
