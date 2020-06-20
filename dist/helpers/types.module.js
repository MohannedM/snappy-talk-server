"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const graphql_1 = require("graphql");
class CustomError extends graphql_1.GraphQLError {
    constructor(message) {
        super(message);
    }
}
exports.CustomError = CustomError;
