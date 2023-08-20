const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            //   validate: /^(?=.*[!@#$%^&*()_\-+=|\\{}\[\]:;<>,.?\/])(?=.*\d{1,})(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).{8,}$/,
        },
        email: {
            type: String,
            //   validate: /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/,
            unique: true,
            trim: true,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'customer'],
        },
        avatar: {
            type: String,
        },
        emailVerified: {
            type: Boolean,
        },
        verificationToken: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
