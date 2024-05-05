// Importing the config module
import dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || 'http://localhost:5000/';
export const PORT = process.env.PORT || 5000;
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1/implantfailuredb';
export const VERSION = 1;
export const ACCESS_TOKEN_SECRET = '985a004a3bb1d1618cd25e8466a28ffee62ded1f4fa0ffa183de0148a77a4f600e4f6395bfedbea44600e5bf87bb7a2d2162efb0e1f64781ac38df06cb59639c';
export const REFRESH_TOKEN_SECRET = '985a004a8bb1d1618cd25e8466a28ffee62ded1h4fa0ffa183de0148a77a4f600e4f6395bfedbea44600e5bf87bb7a2d2162efb0e1f64781ac38df06cb59639c';
export const ACCESS_TOKEN_EXPIRATION = 60 * 30;
export const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 60;