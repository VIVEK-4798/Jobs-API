const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name}, token});
};

const login = async (req, res) => {
    console.log("Login function called");

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        console.log('User does not exist');
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User does not exist' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        console.log('Invalid credentials');
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }

    // If successful login
    const token = user.createJWT();
    console.log('Token created:', token); // Log token to verify
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};


module.exports = {
    register,
    login,
};
