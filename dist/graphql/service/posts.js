"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislikePost = exports.likePost = exports.deletePost = exports.updatePost = exports.getUserPosts = exports.getAllPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../../models/Post"));
const types_module_1 = require("../../helpers/types.module");
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../../models/User"));
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
        if (!validator_1.default.isLength(postInput.description, { min: 10, max: 200 })) {
            errors.push({ message: 'Description should be from 10 to 200 characters!' });
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
exports.getAllPosts = async (_, req) => {
    try {
        const user = await User_1.default.findById(req.userId).populate('postsLiked');
        if (!user || !req.isAuth) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        const posts = await Post_1.default.find().populate('user').populate('likers');
        return posts.map((post) => {
            var _a, _b;
            return {
                _id: post._id.toString(),
                title: post.title,
                description: post.description,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                user: {
                    _id: post.user._id.toString(),
                    firstName: post.user.firstName,
                    lastName: post.user.lastName,
                    email: post.user.email,
                },
                isLiked: ((_a = user.postsLiked) === null || _a === void 0 ? void 0 : _a.findIndex((likedPost) => likedPost._id.toString() === post._id.toString())) === -1
                    ? false
                    : true,
                likers: (_b = post.likers) === null || _b === void 0 ? void 0 : _b.map((user) => {
                    return {
                        _id: user._id.toString(),
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
exports.getUserPosts = async (_, req) => {
    try {
        const user = await User_1.default.findById(req.userId)
            .populate('posts.likers')
            .populate('postsCreated')
            .populate('postsLiked');
        if (!user || !req.isAuth) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        return user.postsCreated.map((post) => {
            var _a, _b;
            return {
                _id: post._id.toString(),
                title: post.title,
                description: post.description,
                imageUrl: post.imageUrl,
                isLiked: ((_a = user.postsLiked) === null || _a === void 0 ? void 0 : _a.findIndex((likedPost) => likedPost._id.toString() === post._id.toString())) === -1
                    ? false
                    : true,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                user: {
                    _id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
                likers: (_b = post.likers) === null || _b === void 0 ? void 0 : _b.map((user) => {
                    return {
                        _id: user._id.toString(),
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
exports.updatePost = async ({ postInput }, req) => {
    try {
        const user = await User_1.default.findById(req.userId);
        const post = await Post_1.default.findById(postInput.postId).populate('user');
        if (!user || !req.isAuth || !post || (post === null || post === void 0 ? void 0 : post.user._id.toString()) !== req.userId) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        const errors = [];
        if (!validator_1.default.isLength(postInput.title, { min: 4, max: 25 })) {
            errors.push({ message: 'Title should be from 4 to 25 characters!' });
        }
        if (!validator_1.default.isLength(postInput.description, { min: 10, max: 200 })) {
            errors.push({ message: 'Description should be from 10 to 200 characters!' });
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
        post.title = postInput.title;
        post.description = postInput.description;
        post.imageUrl = postInput.imageUrl;
        await post.save();
        return {
            _id: post._id.toString(),
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            user: {
                _id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    }
    catch (err) {
        throw err;
    }
};
exports.deletePost = async ({ postId }, req) => {
    try {
        const user = await User_1.default.findById(req.userId);
        const post = await Post_1.default.findById(postId).populate('user');
        if (!user || !req.isAuth || !post || (post === null || post === void 0 ? void 0 : post.user._id.toString()) !== req.userId) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        // fs.unlinkSync(path.join(__dirname, '..', '..', post?.imageUrl));
        await Post_1.default.findByIdAndDelete(postId);
        return true;
    }
    catch (error) {
        throw error;
    }
};
exports.likePost = async ({ postId }, req) => {
    var _a, _b;
    try {
        const user = await User_1.default.findById(req.userId);
        const post = await Post_1.default.findById(postId).populate('user');
        if (!user || !req.isAuth || !post || (post === null || post === void 0 ? void 0 : post.user._id.toString()) !== req.userId) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        await ((_a = post.likers) === null || _a === void 0 ? void 0 : _a.push(user));
        await ((_b = user.postsLiked) === null || _b === void 0 ? void 0 : _b.push(post));
        await post.save();
        await user.save();
        return true;
    }
    catch (error) {
        throw error;
    }
};
exports.dislikePost = async ({ postId }, req) => {
    var _a, _b, _c, _d;
    try {
        const user = await User_1.default.findById(req.userId).populate('postsLiked');
        const post = await Post_1.default.findById(postId).populate('user');
        if (!user || !req.isAuth || !post || (post === null || post === void 0 ? void 0 : post.user._id.toString()) !== req.userId) {
            const error = new types_module_1.CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        const likerIndex = (_a = post.likers) === null || _a === void 0 ? void 0 : _a.findIndex((liker) => liker.toString() === req.userId);
        const postsLikedIndex = (_b = user.postsLiked) === null || _b === void 0 ? void 0 : _b.findIndex((postLiked, index) => postLiked._id.toString() === postId);
        if (likerIndex === -1 || postsLikedIndex === -1) {
            const error = new types_module_1.CustomError('Post not found');
            error.code = 404;
            throw error;
        }
        await ((_c = post.likers) === null || _c === void 0 ? void 0 : _c.splice(likerIndex, 1));
        await ((_d = user.postsLiked) === null || _d === void 0 ? void 0 : _d.splice(postsLikedIndex, 1));
        await post.save();
        await user.save();
        return true;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
