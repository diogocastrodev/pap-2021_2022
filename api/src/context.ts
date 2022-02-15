import * as jwt from 'jsonwebtoken';
import { config, Depromisify } from "./utils";
import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';

/* Resolvers context param */
export interface ResolverContext {
    is_authed: boolean,
    public_id?: string,
    request: Request,
    response: Response
}

interface IContext {
    req: Request,
    res: Response
}

/* This function will be executed when get a GraphQL Request */
export async function context ({ req, res}: IContext): Promise<ResolverContext> {
    /* Initialize context as user not authed */
    const ctx: ResolverContext = {
        is_authed: false,
        request: req,
        response: res
    }

    /* Get Token from headers */
    let token: string = req.headers.authorization || '';
    if(token){
        /* Check if request contains Bearer if so will remove "Bearer " and get only the token */
        if(token.startsWith('Bearer ')) token = token.split(' ')[1];
        
        try {
            /* Check if token is valid */
            const decoded = jwt.verify(token, config.TOKEN_SECRET)
            /* If token isn't valid will return the context as user not authed */
            if(typeof decoded === 'string') return ctx;
            /* 
            otherwise will get user_id and it exists will set authed to true and add the user_id
            so, in GraphQL resolvers will be able to use it or check if user is logged in
            */
            if(decoded.public_id) {
                ctx.is_authed = true;
                ctx.public_id = decoded.public_id
            }
        } catch(e){
            /* Silence */
        }
        return ctx;
    }
    return ctx
}

export type Context = Depromisify<typeof context>