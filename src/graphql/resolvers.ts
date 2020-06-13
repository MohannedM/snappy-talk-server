import * as userResolvers from './service/users';
import { IResolvers } from 'apollo-server-express';

export default <IResolvers>{
    ...userResolvers,
    hello() {
        return {
            id: 'ssss',
            greet: 'Hello',
        };
    },
};
