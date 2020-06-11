"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongoose_1 = require("mongoose");
const envVariables = __importStar(require("./env"));
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const apollo_server_express_1 = require("apollo-server-express");
const app = express_1.default();
const apolloServer = new apollo_server_express_1.ApolloServer({ resolvers: resolvers_1.default, typeDefs: schema_1.default });
app.use(body_parser_1.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow-Access-Control-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader('Allow-Access-Control-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200);
    }
    next();
});
apolloServer.applyMiddleware({ app, path: '/graphql' });
mongoose_1.connect(envVariables.dbConnection)
    .then(() => {
    app.listen('8080');
})
    .catch((err) => console.log(err));
