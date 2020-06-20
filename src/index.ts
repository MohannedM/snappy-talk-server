import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { connect } from 'mongoose';
import * as envVariables from './env';
import graphqlSchema from './graphql/schema';
import graphqlHttp from 'express-graphql';
import resolvers from './graphql/resolvers';
import auth from './middlewares/auth';
import 'express-graphql';
import path from 'path';
import multer from 'multer';
import uuid from 'uuid';
import e from 'express';
import { authRequest } from './helpers/types.module';
const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow-Access-Control-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader('Allow-Access-Control-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }

    next();
});

app.use('*', auth);
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images');
    },
    filename(req, file, cb) {
        cb(null, uuid.v4());
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (!req.isAuth) return cb(null, false);
    if (file.mimeType === 'image/png' || file.mimeType === 'image/jpg' || file.mimeType === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.use(multer({ storage, fileFilter }).single('image'));

app.put('/api/add-image', (req: authRequest, res: Response, next: NextFunction) => {
    if (!req.isAuth) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (req.file) {
        const imageUrl = req.file.path.replace('\\', '/');
        imageUrl ? res.status(201).json({ imageUrl }) : res.status(400).json({ error: 'Image upload failed' });
        return;
    } else if (!req.file) {
        res.status(200).json({ imageUrl: '' });
        return;
    }
});

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: resolvers,
        graphiql: true,
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            return { message: err.message, data: err.originalError };
        },
    }),
);

connect(envVariables.dbConnection)
    .then(() => {
        app.listen('8080');
    })
    .catch((err) => console.log(err));
