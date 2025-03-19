const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer ")[1];
    if (!token) return res.status(401).json(
        {
            status: 401,
            message: "Unauthorized",
            localDate: new Date()
        }
    );
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json(
            {
                status: 401,
                message: "Token is invalid",
                localDate: new Date()
            }
        );
    }
};

exports.adminAuthorities = (req, res, next) => {
    if (req.user.role !== "ADMIN") return res.status(403).json(
        {
            status: 403,
            message: "You are not authorized to perform this action",
            localDate: new Date()
        }
    );
    next();
};

exports.userAuthorities = (req, res, next) => {
    if (req.user.role !== "USER") return res.status(403).json(
        {
            status: 403,
            message: "You are not authorized to perform this action",
            localDate: new Date()
        }
    );
    next();
};


