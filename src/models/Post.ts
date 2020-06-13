import { Schema, model, Document } from 'mongoose';
import { UserDocument } from './User';
export interface PostDocument extends Document {
    title: string;
    description: string;
    imageUrl: string;
    user: UserDocument;
    likes?: UserDocument[];
}

const postSchema = new Schema(
    {
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
        user: {
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
    },
    { timestamps: true },
);

export default model<PostDocument>('Post', postSchema);
