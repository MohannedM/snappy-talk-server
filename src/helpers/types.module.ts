import { Document } from 'mongoose';
export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    postsCreated?: PostDocument[];
    postsLiked?: string[];
}

export interface PostDocument extends Document {
    title: string;
    description: string;
    imageUrl: string;
    userId: UserDocument;
    likes?: UserDocument[];
}
