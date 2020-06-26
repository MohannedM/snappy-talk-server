export interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
    postsCreated?: PostData[];
    postsLiked?: PostData[];
}

export interface PostData {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    user: UserData | string;
    likers?: UserData[];
    createdAt: string;
    updatedAt: string;
}

export interface registerArgs {
    userInput: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}

export interface loginArgs {
    userInput: {
        email: string;
        password: string;
    };
}

export interface createPostArgs {
    postInput: {
        title: string;
        description: string;
        imageUrl: string;
    };
}

export interface updatePostArgs {
    postInput: {
        postId: string;
        title: string;
        description: string;
        imageUrl: string;
    };
}

export interface deletePostArgs {
    postId: string;
}
