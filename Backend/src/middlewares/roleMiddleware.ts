import { Request, Response, NextFunction } from 'express';

interface User {
    role: string;
    _id: string;
}

interface RequestWithUser extends Request {
    user?: User;
}

interface RoleMiddleware {
    (roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
}

const roleMiddleware: RoleMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req as RequestWithUser;
        if (!user.user || !roles.includes(user.user.role)) {
            return res.status(403).json({ message: "Access denied." });
        }
        next();
    };
};

module.exports = roleMiddleware;
