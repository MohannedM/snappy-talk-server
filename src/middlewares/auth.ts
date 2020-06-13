import { RequestHandler } from 'express';
import { authRequest, jwtObject } from '../helpers/types.module';
import jwt from 'jsonwebtoken';

const auth: RequestHandler = (req: authRequest, res, next) => {
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
    const decodedToken = <jwtObject>jwt.verify(token, 'supersecret');

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};

export default auth;
