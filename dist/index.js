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
const express_graphql_1 = __importDefault(require("express-graphql"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const auth_1 = __importDefault(require("./middlewares/auth"));
require("express-graphql");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const app = express_1.default();
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
app.use(body_parser_1.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow-Access-Control-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader('Allow-Access-Control-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    next();
});
app.use('*', auth_1.default);
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images');
    },
    filename(req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (!req.isAuth)
        return cb(null, false);
    if (file.mimeType === 'image/png' || file.mimeType === 'image/jpg' || file.mimeType === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(multer_1.default({ storage, fileFilter }).single('image'));
app.put('/api/add-image', (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    if (!req.isAuth) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (req.file) {
        const imageUrl = req.file.path.replace('\\', '/');
        imageUrl ? res.status(201).json({ imageUrl }) : res.status(400).json({ error: 'Image upload failed' });
        return;
    }
    else if (!req.file) {
        res.status(200).json({ imageUrl: '' });
        return;
    }
});
app.use('/graphql', express_graphql_1.default({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true,
    customFormatErrorFn(err) {
        if (!err.originalError) {
            return err;
        }
        return { message: err.message, data: err.originalError };
    },
}));
mongoose_1.connect(envVariables.dbConnection)
    .then(() => {
    app.listen('8080');
})
    .catch((err) => console.log(err));
