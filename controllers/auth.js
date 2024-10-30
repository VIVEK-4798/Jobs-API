const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const BadRequestError = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name}, token});
};

const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !pawword){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
};


module.exports = {
    register,
    login,
};
