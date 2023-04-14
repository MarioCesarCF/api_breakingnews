import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';

const loginService = async (email) => User.findOne({ email: email }).select("+password");

const generateToken = (id) => jwt.sign({id: id}, process.env.KEY_TOKEN, {expiresIn: 86400});

//tentativas de upload e download de arquivos com node
const uploadService = async (file) => Post.create(file);
const downloadService = (id) => Post.findById(id);
  
export { loginService, generateToken, uploadService, downloadService };