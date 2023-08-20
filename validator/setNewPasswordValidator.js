const { check, validationResult } = require('express-validator');

const newPasswordValidator = [
    check('newPassword')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol',
        ),
];

const newPasswordValidationHandler = function (req, res, next) {
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
    newPasswordValidator,
    newPasswordValidationHandler,
};
