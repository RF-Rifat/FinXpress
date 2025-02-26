const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

interface TokenPayload {
    id: string;
    role: string;
}

const generateToken = (userId: string, role: string): string => {
    const payload: TokenPayload = { id: userId, role };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

interface VerifyToken {
    (token: string): TokenPayload;
}

const verifyToken: VerifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

module.exports = { generateToken, verifyToken };
