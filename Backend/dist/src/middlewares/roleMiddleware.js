"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req;
        if (!user.user || !roles.includes(user.user.role)) {
            return res.status(403).json({ message: "Access denied." });
        }
        next();
    };
};
module.exports = roleMiddleware;
