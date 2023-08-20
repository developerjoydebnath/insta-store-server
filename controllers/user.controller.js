const User = require('../models/user.model');
const { accessTokenGenerator, refreshTokenGenerator, refreshTokenValidator } = require('../utils/tokenGenarator');
const bcrypt = require('bcrypt');

// use me
const index = async (req, res) => {
    // const user = await User.findOneById(req.user.id);
    return res.status(200).json({
        user: {
            email: req.decodedEmail,
            id: req.decodedUserId,
            username: req.decodedUsername,
            role: req.decodedRole,
        },
    });
};

// user signup
const signup = async (req, res) => {
    try {
        const { username, password, email, role, avatar, emailVerified, verificationToken, phoneNumber, address } =
            req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(500).json({ message: 'User already registered!' });
        } else {
            // hash the password before sign up
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                password: hashedPassword,
                email,
                role,
                avatar,
                emailVerified,
                verificationToken,
                phoneNumber,
                address,
            });

            if (!user) {
                return res.status(500).json({ message: 'user not created!' });
            } else {
                const tokenPayload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                };

                // create the access token and refresh token
                const accessToken = await accessTokenGenerator(tokenPayload);
                const refreshToken = await refreshTokenGenerator(tokenPayload);

                // set the refresh token to the secret cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: true,
                    secure: true,
                    expires: new Date(Date.now() + 86400000),
                });

                // return response
                return res.status(200).json({
                    data: {
                        accessToken,
                        user: tokenPayload,
                    },
                });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({ message: 'All fields are required!' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Invalid credential!' });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(404).json({ message: 'Invalid credential!' });
        }

        const tokenPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        // create the access token and refresh token
        const accessToken = await accessTokenGenerator(tokenPayload);
        const refreshToken = await refreshTokenGenerator(tokenPayload);

        // set the refresh token to the secret cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: true,
            secure: true,
            expires: new Date(Date.now() + 86400000),
        });

        // return response
        return res.status(200).json({
            data: {
                accessToken,
                user: tokenPayload,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// user logout
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'successfully logged out', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'something went wrong. user not logged out!' });
    }
};

// refresh token
const refreshUser = async (req, res) => {
    // get refresh token from cookie
    const rToken = req.cookies['refreshToken'];

    if (!rToken) return res.status(401).json({ message: 'Refresh token not found' });
    const payload = await refreshTokenValidator(rToken);

    const tokenPayload = {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        role: payload.role,
    };

    // create the access token and refresh token
    const accessToken = await accessTokenGenerator(tokenPayload);
    const refreshToken = await refreshTokenGenerator(tokenPayload);

    // set the refresh token to the secret cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
        expires: new Date(Date.now() + 86400000),
    });

    return res.status(200).json({
        accessToken,
        user: tokenPayload,
    });
};

module.exports = { signup, login, refreshUser, index, logout };
