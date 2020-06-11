import { buildSchema } from 'graphql';

export default `
    type RootQuery{
        hello: String!
    }
    schema{
        query: RootQuery
    }
`;
