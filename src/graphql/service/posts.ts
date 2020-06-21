import Post from '../../models/Post';
import { PostData, createPostArgs, deletePostArgs } from './types.modules';
import { authRequest, CustomError } from '../../helpers/types.module';
import validator from 'validator';
import User from '../../models/User';
import fs from 'fs';
import path from 'path';

export const createPost: (args: createPostArgs, req: authRequest) => Promise<PostData | undefined> = async (
    { postInput },
    req,
) => {
    try {
        const errors = [];
        const user = await User.findById(req.userId);
        if (!req.isAuth || !user) {
            const error = new CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        if (!validator.isLength(postInput.title, { min: 4, max: 25 })) {
            errors.push({ message: 'Title should be from 4 to 25 characters!' });
        }
        if (!validator.isLength(postInput.description, { min: 10, max: 100 })) {
            errors.push({ message: 'Description should be from 10 to 100 characters!' });
        }
        if (validator.isEmpty(postInput.imageUrl, { ignore_whitespace: true })) {
            errors.push({ message: 'Image should not be empty!' });
        }

        if (errors.length > 0) {
            const error = new CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const post = new Post({
            title: postInput.title,
            description: postInput.description,
            imageUrl: postInput.imageUrl,
            user,
        });
        const savedPost = await post.save();
        user.postsCreated?.push(savedPost);
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
    } catch (err) {
        throw err;
    }
};

export const getAllPosts: (args: any, req: authRequest) => Promise<PostData[] | undefined> = async (args, req) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !req.isAuth) {
            const error = new CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        const posts = await Post.find().populate('user').populate('likers');
        return posts.map((post) => {
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
                likers: post.likers?.map((user) => {
                    return {
                        _id: user._id,
                        firstName: post.user.firstName,
                        lastName: post.user.lastName,
                        email: post.user.email,
                    };
                }),
            };
        });
    } catch (err) {
        throw err;
    }
};

export const getUserPosts: (args: any, req: authRequest) => Promise<PostData[] | undefined> = async (args, req) => {
    try {
        const user = await User.findById(req.userId).populate('posts.likers').populate('posts');
        if (!user || !req.isAuth) {
            const error = new CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        return user.postsCreated!.map((post) => {
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
                likers: post.likers?.map((user) => {
                    return {
                        _id: user._id,
                        firstName: post.user.firstName,
                        lastName: post.user.lastName,
                        email: post.user.email,
                    };
                }),
            };
        });
    } catch (err) {
        throw err;
    }
};

export const deletePost: (args: deletePostArgs, req: authRequest) => Promise<boolean | undefined> = async (
    { postId },
    req,
) => {
    try {
        const user = await User.findById(req.userId);
        const post = await Post.findById(postId).populate('user');
        if (!user || !req.isAuth || !post || post?.user._id !== req.userId) {
            const error = new CustomError('Unauthorized');
            error.code = 401;
            throw error;
        }
        fs.unlinkSync(path.join(__dirname, '..', '..', post?.imageUrl));
        await Post.findByIdAndDelete(postId);
        return true;
    } catch (err) {
        throw err;
    }
};
