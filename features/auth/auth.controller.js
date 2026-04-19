import User from '../user/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//genrate token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//register user
const register = async (req, res) => {}

//login user
const login = async (req, res) => {
}

//get user profile
const getProfile = async (req, res) => {
  
}


//update user profile
const updateProfile = async (req, res) => {

}

export { register, login, getProfile, updateProfile };
