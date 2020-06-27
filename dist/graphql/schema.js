"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.default = graphql_1.buildSchema(`

    input RegisterInputData{
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input LoginInputData{
        email: String!
        password: String!
    }

    input PostInputType{
        title: String!
        description: String!
        imageUrl: String!
    }

    input PostUpdateInputType{
        postId: String!
        title: String!
        description: String!
        imageUrl: String!
    }

    type Post{
        _id: String!
        title: String!
        description: String!
        imageUrl: String!
        user: User!
        likers: [User]!
        isLiked: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type User{
        _id: String!
        token: String!
        firstName: String!
        lastName: String!
        email: String!
        postsCreated: [Post!]!
        postsLiked: [Post!]!
    }

    type RootQuery{
        getAllPosts: [Post!]!
        getUserPosts: [Post!]!
    }

    type RootMutation{
        register(userInput: RegisterInputData): User!
        login(userInput: LoginInputData): User!
        createPost(postInput: PostInputType): Post!
        updatePost(postInput: PostUpdateInputType): Post!
        deletePost(postId: String!): Boolean!
        likePost(postId: String!): Boolean!
        dislikePost(postId: String!): Boolean!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
