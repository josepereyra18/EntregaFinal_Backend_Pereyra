import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password);

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return null;
    }
};

export const generateToken = (email) => {
    const payload = { email };
    const secret = process.env.SECRET_KEY;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};

export default __dirname;