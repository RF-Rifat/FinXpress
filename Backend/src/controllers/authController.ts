import { Request, Response } from "express";

export const register = (req: Request, res: Response) => {
    const { name, pin, mobileNumber, email, accountType, nid } = req.body
    try {
        const existingUser = await User.findOne({ mobileNumber });
    } catch (error) {
        
    }
};
