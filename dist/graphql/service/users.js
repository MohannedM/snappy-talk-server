"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_module_1 = require("../../helpers/types.module");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.register = async ({ userInput }, _req) => {
    try {
        const errors = [];
        if (!validator_1.default.isEmail(userInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (!validator_1.default.isLength(userInput.firstName, { min: 2, max: 14 })) {
            errors.push({ message: 'First name should be from 2 to 14 characters in length.' });
        }
        if (!validator_1.default.isLength(userInput.lastName, { min: 2, max: 14 })) {
            errors.push({ message: 'Last name should be from 2 to 14 characters in length.' });
        }
        if (!validator_1.default.isLength(userInput.password, { min: 6, max: 20 })) {
            errors.push({ message: 'Password should be from 6 to 20 characters.' });
        }
        const userExist = await User_1.default.findOne({ email: userInput.email });
        if (userExist) {
            errors.push({ message: 'Email already exists' });
        }
        if (errors.length > 0) {
            const error = new types_module_1.CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const hashedPassword = await bcryptjs_1.default.hash(userInput.password, 12);
        const newUser = new User_1.default({
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            email: userInput.email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        const token = await jsonwebtoken_1.default.sign({
            userId: user._id.toString(),
            email: user.email,
        }, 'supersecret');
        return {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.login = async ({ userInput }, _req) => {
    try {
        const errors = [];
        if (!validator_1.default.isEmail(userInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (!validator_1.default.isLength(userInput.password, { min: 6, max: 20 })) {
            errors.push({ message: 'Password should be from 6 to 20 characters.' });
        }
        const user = await User_1.default.findOne({ email: userInput.email });
        if (!user) {
            errors.push({ message: 'Email or password is incorrect' });
        }
        const isPassword = await bcryptjs_1.default.compare(userInput.password, user.password);
        if (!isPassword) {
            errors.push({ message: 'Email or password is incorrect' });
        }
        if (errors.length > 0) {
            const error = new types_module_1.CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const token = await jsonwebtoken_1.default.sign({
            userId: user._id.toString(),
            email: user.email,
        }, 'supersecret');
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: token,
        };
    }
    catch (err) {
        throw err;
    }
};
