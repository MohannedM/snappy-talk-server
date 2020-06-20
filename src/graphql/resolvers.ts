import * as userResolvers from './service/users';
import * as postsResolvers from './service/posts';
import { IResolvers } from 'apollo-server-express';

export default <IResolvers>{
    ...userResolvers,
    ...postsResolvers,
};
