import User from '../../models/User';
import Post from '../../models/Post';
import jwt from 'jsonwebtoken';
import { authRequest, CustomError } from '../../helpers/types.module';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

interface RegisterInputData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginInputData {
    email: string;
    password: string;
}

interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    postsCreated?: [];
    postsLiked?: [];
}

interface registerArgs {
    userInput: RegisterInputData;
}

interface loginArgs {
    userInput: LoginInputData;
}

export const register: (args: registerArgs, req: authRequest) => Promise<UserData | undefined> = async (
    { userInput },
    _req,
) => {
    try {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (!validator.isLength(userInput.firstName, { min: 2, max: 14 })) {
            errors.push({ message: 'First name should be from 2 to 14 characters in length.' });
        }

        if (!validator.isLength(userInput.lastName, { min: 2, max: 14 })) {
            errors.push({ message: 'Last name should be from 2 to 14 characters in length.' });
        }

        if (!validator.isLength(userInput.password, { min: 6, max: 20 })) {
            errors.push({ message: 'Password should be from 6 to 20 characters.' });
        }

        const userExist = await User.findOne({ email: userInput.email });
        if (userExist) {
            errors.push({ message: 'Email already exists!' });
        }

        if (errors.length > 0) {
            const error = new CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const hashedPassword = await bcryptjs.hash(userInput.password, 12);

        const newUser = new User({
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            email: userInput.email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        const token = await jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            'supersecret',
        );

        return {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token,
        };
    } catch (err) {
        throw err;
    }
};

export const login: (args: loginArgs, req: authRequest) => Promise<UserData | undefined> = async (
    { userInput },
    _req,
) => {
    try {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }

        if (!validator.isLength(userInput.password, { min: 6, max: 20 })) {
            errors.push({ message: 'Password should be from 6 to 20 characters.' });
        }

        const user = await User.findOne({ email: userInput.email });
        if (!user) {
            errors.push({ message: 'Email or password is incorrect!' });
            const error = new CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const isPassword = await bcryptjs.compare(userInput.password, user!.password);

        if (!isPassword) {
            errors.push({ message: 'Email or password is incorrect!' });
        }

        if (errors.length > 0) {
            const error = new CustomError('Invalid Input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const token = await jwt.sign(
            {
                userId: user!._id.toString(),
                email: user!.email,
            },
            'supersecret',
        );

        return {
            _id: user!._id,
            firstName: user!.firstName,
            lastName: user!.lastName,
            email: user!.email,
            token: token,
        };
    } catch (err) {
        throw err;
    }
};
