import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { connect } from 'mongoose';
import * as envVariables from './env';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';

const app = express();
const apolloServer = new ApolloServer({ resolvers, typeDefs });

app.use(json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow-Access-Control-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader('Allow-Access-Control-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200);
    }

    next();
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

connect(envVariables.dbConnection)
    .then(() => {
        app.listen('8080');
    })
    .catch((err) => console.log(err));
