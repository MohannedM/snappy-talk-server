import { Schema, model } from 'mongoose';
import { PostDocument } from '../helpers/types.module';

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    likers: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    ],
});

export default model<PostDocument>('Post', postSchema);
