import { model, Schema, Document } from 'mongoose';
import Post, { PostDocument } from './Post';
export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    postsCreated?: PostDocument[];
    postsLiked?: PostDocument[];
}

const userSchema = new Schema({
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        index: true,
    },
    password: {
        required: true,
        type: String,
    },
    postsCreated: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
    ],
    postsLiked: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
    ],
});

export default model<UserDocument>('User', userSchema);
