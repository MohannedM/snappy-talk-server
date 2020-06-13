import { buildSchema } from 'graphql';
export default buildSchema(`

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

    type Post{
        _id: String!
        title: String!
        description: String!
        imageUrl: String!
        user: User!
        likers: [User]!
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
        hello: String!
    }

    type RootMutation{
        register(userInput: RegisterInputData): User
        login(userInput: LoginInputData): User
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
