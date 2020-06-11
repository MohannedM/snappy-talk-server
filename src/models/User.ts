import { model, Schema } from 'mongoose';
import { UserDocument } from '../helpers/types.module';

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
            postId: Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
    ],
    postsLiked: [
        {
            postId: Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
    ],
});

export default model<UserDocument>('User', userSchema);
