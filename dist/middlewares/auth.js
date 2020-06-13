"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        req.isAuth = false;
        return next();
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, 'supersecret');
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};
exports.default = auth;
