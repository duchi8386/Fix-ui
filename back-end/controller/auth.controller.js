const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
    try {
        const {fullName, email, password, phoneNumber, address} = req.body;
        const existedUser = await User.findOne({email});
        if (existedUser) {
            return res.status(400).json(
                {
                    status: 400,
                    error: 'User already exists',
                    localDate: new Date()
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({fullName, email, password: hashedPassword, phoneNumber, address, role: "USER"});
        await newUser.save();

        res.status(201).json(
            {
                status: 201,
                message: "Register successfully",
                localDate: new Date()
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                status: 500,
                message: error.message,
                localDate: new Date()
            }
        )
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(400).json(
            {
                status: 400,
                message: "User not exist",
                localDate: new Date(),
            }
        );
        if(user.status === "INACTIVE") {
            res.status(400).json({
                status: 400,
                message: "User is inactive so cannot log in",
                localDate: new Date()
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json(
            {
                status: 400,
                message: "Incorrect password",
                localDate: new Date()
            }
        );

        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h", algorithm:"HS256"});
        res.status(200).json(
            {
                status: 200,
                token: token,
                message: "Login successfully",
                localDate: new Date()
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                message: error.message,
                localDate: new Date()
            }
        );
    }
};