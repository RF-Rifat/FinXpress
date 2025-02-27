"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    email: process.env.EMAIL,
    emailUser: process.env.EMAIL,
    email_secret: process.env.EMAIL_PASSWORD,
    frontend_url: process.env.FRONTEND_URL,
    verification_url: process.env.EMAIL_VERIFICATION_URL,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    reset_password_url: process.env.RESET_PASSWORD_URL,
    verify_user_url: process.env.VERIFY_USER_URL,
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESSTOKEN_SECRET,
        refreshTokenSecret: process.env.JWT_REFRESHTOKEN_SECRET,
        accessTokenExpireIn: process.env.JWT_ACCESSTOKEN_EXPIRE,
        refreshTokenExpireIn: process.env.JWT_REFRESHTOKEN_EXPIRE,
        tokenSecret: process.env.JWT_TOKEN_SECRET,
    },
};
