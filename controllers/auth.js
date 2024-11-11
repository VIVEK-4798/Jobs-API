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
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User does not exist' });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }

    // If user exists and password is correct, create and return token
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
    register,
    login,
};
