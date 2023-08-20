const nodemailer = require('nodemailer');
const Transport = require('nodemailer-sendinblue-transport');
const randomString = require('randomstring');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { btnControllerTokenGenerator, btnControllerTokenValidator } = require('../utils/tokenGenarator');

// creating a transporter
const transporter = nodemailer.createTransport(new Transport({ apiKey: process.env.EMAIL_API_SECRET_KEY }));

// email sending functionality
const resetPasswordEmail = (user, token) => {
    const { email, username } = user;
    const bookingEmail = {
        to: email,
        from: 'instashop@gmail.com',
        subject: 'Password reset',
        text: `
    Hello ${username},
    We have received a password reset request from your email address (${email}). Use this verification token to reset your password. The token will be expired in 5 minuets. Please request for a new token if this token is expired. Please check your spam folder in gmail if your don't find the the email in inbox.
    Password reset token: ${token}
    Ignore this email if you do not make this request. And if it wasn't you please contact to our support center.

    Best whishes to you
    Insta Store
    `,
        html: `<div>
      <h2>Hello ${username},</h2>
      <h3>We have received a password reset request from your email address (${email}). Use this verification token to reset your password. The token will be expired in 5 minuets. Please request for a new token if this token is expired. Please check your spam folder in gmail if your don't find the the email in inbox.</h3>
      <h2 style:"font-size: 16px; display: inline;">Password reset token:</h2> <h2 style="color: red; font-size: 32px; font-weight: bold; background-color: yellow; display: inline; padding: 5px 10px; margin-left: 10px;">${token}</h2>
      <h3>Ignore this email if you do not make this request. And if it wasn't you please contact to our support center.</h3>
      <br />
      <h3>Best whishes to you</h3>
      <h3><span>Insta</span><span style="color: red;">Store</span></h3>
      </div>`,
    };

    transporter.sendMail(bookingEmail, function (err, res) {
        if (err) {
            console.log(err);
        }
        console.log(res);
    });
};

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            const token = randomString.generate(8);
            const hashedToken = await bcrypt.hash(token, 10);

            // set the hashed token to the user info
            await User.findByIdAndUpdate(userExist._id, { verificationToken: hashedToken });

            // token will be expired automatically after 5 minutes of sending the email
            setTimeout(async () => {
                await User.findByIdAndUpdate(userExist._id, { verificationToken: '' });
            }, 1000 * 60 * 5);

            // send the verification email with token
            resetPasswordEmail(userExist, token);

            const btnControllerToken = await btnControllerTokenGenerator({ email });

            // set the refresh token to the secret cookie
            res.cookie('token', btnControllerToken, {
                httpOnly: true,
                sameSite: true,
                secure: true,
                expires: new Date(Date.now() + 1000 * 60 * 2),
            });

            return res.status(200).json({ email: userExist.email, success: true });
        } else {
            return res.status(500).json({ message: 'User does not exist!' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const verifyResetPasswordCode = async (req, res) => {
    try {
        const { email, token } = req.body;
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            const savedToken = userExist.verificationToken;
            if (savedToken) {
                const matched = await bcrypt.compare(token, savedToken);
                if (matched) {
                    await User.findByIdAndUpdate(userExist._id, { verificationToken: '' });
                    return res.status(200).json({ id: userExist._id });
                } else {
                    return res.status(500).json({ message: 'Token does not match!' });
                }
            } else {
                return res.status(500).json({ message: 'Token expired!' });
            }
        } else {
            return res.status(500).json({ message: 'Something went wrong. Please try again!' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const setNewPassword = async (req, res) => {
    try {
        const { id, newPassword } = req.body;

        const userExist = await User.findById(id);
        if (userExist) {
            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            await User.findByIdAndUpdate(userExist._id, { password: newHashedPassword });
            return res.status(200).json({ message: 'Password updated successfully.', success: true });
        } else {
            return res.status(500).json({ message: 'Something went wrong. Please try again!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
};

const btnDisableChecking = async (req, res) => {
    try {
        const token = req.cookies['token'];

        if (token) {
            const payload = await btnControllerTokenValidator(token);
            if (payload) {
                return res.status(200).json({ message: payload, success: true });
            } else {
                return res.status(401).json({ message: 'token expired', success: false });
            }
        } else {
            return res.status(401).json({ message: 'Refresh token not found', success: false });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { resetPassword, verifyResetPasswordCode, setNewPassword, btnDisableChecking };
