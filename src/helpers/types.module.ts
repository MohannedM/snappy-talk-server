import { Request } from 'express';
import { GraphQLError } from 'graphql';
export interface authRequest extends Request {
    isAuth?: Boolean;
    userId?: string | null;
}

export interface jwtObject {
    userId: string;
    email: string;
}

export class CustomError extends GraphQLError {
    public code!: number;
    public data!: any[];

    constructor(message: string) {
        super(message, undefined, undefined, undefined, undefined, undefined);
    }
}
