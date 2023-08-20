const {
    resetPassword,
    verifyResetPasswordCode,
    setNewPassword,
    btnDisableChecking,
} = require('../controllers/resetPassword.controller');
const { signup, login, refreshUser, index, logout } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/authorize');
const { newPasswordValidator, newPasswordValidationHandler } = require('../validator/setNewPasswordValidator');
const { addUserValidator, addUserValidationHandler } = require('../validator/userValidator');

const router = require('express').Router();

router.post('/signup', addUserValidator, addUserValidationHandler, signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-token', verifyResetPasswordCode);
router.post('/set-new-password', newPasswordValidator, newPasswordValidationHandler, setNewPassword);

router.get('/refresh', refreshUser);
router.get('/checkBtn', btnDisableChecking);
router.get('/index', verifyJWT, index);

module.exports = router;
