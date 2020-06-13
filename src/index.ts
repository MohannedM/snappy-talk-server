import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { connect } from 'mongoose';
import * as envVariables from './env';
import graphqlSchema from './graphql/schema';
import graphqlHttp from 'express-graphql';
import resolvers from './graphql/resolvers';
import auth from './middlewares/auth';
import 'express-graphql';
import { CustomError } from './helpers/types.module';

const app = express();

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
