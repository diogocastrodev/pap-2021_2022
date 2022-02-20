import bcrypt from 'bcrypt';
import { createWriteStream } from 'fs';
import { ReadStream } from 'fs-capacitor';
import shortid from 'shortid';
import { finished } from 'stream/promises';
import { db } from '../../database';

export const createPassword = (pwd: string): string => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd, salt);
    return hash;
}

export const verifyPassword = (pwd: string, hash: string): boolean => {
    return bcrypt.compareSync(pwd, hash);
}

export const getUserIDByPublicID = async (publicID: string): Promise<string> => {
    const user = await db.user.findUnique({
        where: {
            public_user_id: publicID
        }
    })

    if(!user) {
        throw new Error('User not found');
    }

    return user.user_id;
}
