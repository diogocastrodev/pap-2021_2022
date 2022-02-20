import bcrypt from 'bcrypt';

export const createPassword = (pwd: string): string => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd, salt);
    return hash;
}

export const verifyPassword = (pwd: string, hash: string): boolean => {
    return bcrypt.compareSync(pwd, hash);
}