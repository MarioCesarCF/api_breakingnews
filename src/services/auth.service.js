import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const loginService = async (email) => User.findOne({ email: email }).select("+password");

const generateToken = (id) => jwt.sign({id: id}, process.env.KEY_TOKEN, {expiresIn: 86400});

export { loginService, generateToken };