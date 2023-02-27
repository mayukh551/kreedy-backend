const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthError = require('../Error/AuthError');
const User = require('../Models/user.model');

// function to register a new user
async function registerUser(req, res, next) {
    console.log('In register');
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            next(new AuthError('User already exists'))
        }

        // create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // save the user to the database
        await newUser.save();

        require("dotenv").config({ path: '../.env' });
        const privateKey = process.env.PRIVATE_KEY;

        // generate a JWT token
        const token = jwt.sign({ name, email }, privateKey, {
            expiresIn: '1h'
        });

        res.status(201).json({ isSuccess: true, token });
    } catch (error) {
        next(error);
    }
}

// function to log in a user
async function loginUser(req, res, next) {
    console.log('In login');
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            next(new AuthError('Invalid email or password'))
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            next(new AuthError('Invalid email or password'))
        }

        require("dotenv").config({ path: '../.env' });
        const privateKey = process.env.PRIVATE_KEY;
        // generate a JWT token
        const token = jwt.sign({ name: user.name, email }, privateKey, {
            expiresIn: '1h'
        });

        res.status(200).json({ isSuccess: true, token });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registerUser,
    loginUser
}