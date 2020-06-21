"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getUserPosts = exports.getAllPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../../models/Post"));
const types_module_1 = require("../../helpers/types.module");
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../../models/User"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.createPost = async ({ postInput }, req) => {
    var _a;
    try {
        const errors = [];
        const user = await User_1.default.findById(req.userId);
        if (!req.isAuth || !user) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        if (!validator_1.default.isLength(postInput.title, { min: 4, max: 25 })) {
            errors.push({ message: 'Title should be from 4 to 25 characters!' });
        }
        if (!validator_1.default.isLength(postInput.description, { min: 10, max: 100 })) {
            errors.push({ message: 'Description should be from 10 to 100 characters!' });
        }
        if (validator_1.default.isEmpty(postInput.imageUrl, { ignore_whitespace: true })) {
            errors.push({ message: 'Image should not be empty!' });
        }
        if (errors.length > 0) {
            const error = new types_module_1.CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const post = new Post_1.default({
            title: postInput.title,
            description: postInput.description,
            imageUrl: postInput.imageUrl,
            user,
        });
        const savedPost = await post.save();
        (_a = user.postsCreated) === null || _a === void 0 ? void 0 : _a.push(savedPost);
        await user.save();
        return {
            _id: savedPost._id.toString(),
            title: savedPost.title,
            description: savedPost.description,
            imageUrl: savedPost.imageUrl,
            user: {
                _id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            createdAt: savedPost.createdAt.toISOString(),
            updatedAt: savedPost.updatedAt.toISOString(),
        };
    }
    catch (err) {
        throw err;
    }
};
exports.getAllPosts = async (args, req) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user || !req.isAuth) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        const posts = await Post_1.default.find().populate('user').populate('likers');
        return posts.map((post) => {
            var _a;
            return {
                _id: post._id.toString(),
                title: post.title,
                description: post.description,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                user: {
                    _id: post.user._id.toString,
                    firstName: post.user.firstName,
                    lastName: post.user.lastName,
                    email: post.user.email,
                },
                likers: (_a = post.likers) === null || _a === void 0 ? void 0 : _a.map((user) => {
                    return {
                        _id: user._id,
                        firstName: post.user.firstName,
                        lastName: post.user.lastName,
                        email: post.user.email,
                    };
                }),
            };
        });
    }
    catch (err) {
        throw err;
    }
};
exports.getUserPosts = async (args, req) => {
    try {
        const user = await User_1.default.findById(req.userId).populate('posts.likers').populate('posts');
        if (!user || !req.isAuth) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        return user.postsCreated.map((post) => {
            var _a;
            return {
                _id: post._id.toString(),
                title: post.title,
                description: post.description,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                user: {
                    _id: post.user._id.toString,
                    firstName: post.user.firstName,
                    lastName: post.user.lastName,
                    email: post.user.email,
                },
                likers: (_a = post.likers) === null || _a === void 0 ? void 0 : _a.map((user) => {
                    return {
                        _id: user._id,
                        firstName: post.user.firstName,
                        lastName: post.user.lastName,
                        email: post.user.email,
                    };
                }),
            };
        });
    }
    catch (err) {
        throw err;
    }
};
exports.deletePost = async ({ postId }, req) => {
    try {
        const user = await User_1.default.findById(req.userId);
        const post = await Post_1.default.findById(postId).populate('user');
        if (!user || !req.isAuth || !post || (post === null || post === void 0 ? void 0 : post.user._id) !== req.userId) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        fs_1.default.unlinkSync(path_1.default.join(__dirname, '..', '..', post === null || post === void 0 ? void 0 : post.imageUrl));
        await Post_1.default.findByIdAndDelete(postId);
        return true;
    }
    catch (err) {
        throw err;
    }
};
