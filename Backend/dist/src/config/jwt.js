"use strict";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const generateToken = (userId, role) => {
    const payload = { id: userId, role };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
module.exports = { generateToken, verifyToken };
