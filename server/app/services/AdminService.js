// const SmsService = require("./SmsService");
import AdminRepository from "../repository/AdminRepository.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../../config.js";

export default class AdminService {

    static async signin(name, password, phone) {
        try {
            var resObj = { canSingIn: true, userExist: true, smsCode: true };

            // create user
            const hash = await bcrypt.hash(password, 10)
            const obj = {
                name: name,
                phone: phone,
                password: hash,
                role: 'admin'
            }
            await AdminRepository.create(obj)

            // send sms
            // const smsCode = await SmsService.verification(phone)
            // if (!smsCode) {
            //     resObj.smsCode = false;
            //     return resObj;
            // }
            // resObj.smsCode = smsCode;

            return resObj;
        } catch (error) {
            console.log('AdminService.signin:: ' + error);
        }
    }

    static async login(phone, password) {
        try {
            var resObj = {
                userLogin: true, userExist: true, smsCode: true,
                refreshTokenSaved: true, accessToken: "", refreshToken: ""
            };

            // check if password is matched
            var password_matched = false
            const user = await AdminRepository.getOne({ filter: { phone: phone } }, 'password');
            if (user && user.password) password_matched = await bcrypt.compare(password, user.password);
            if (!password_matched) {
                resObj.userLogin = false;
                return resObj;
            }

            const userObj = { _id: user._id, name: user.name, role: user.role }
            const tokens = await this.createAccessToken(userObj);
            resObj.accessToken = tokens.accessToken;
            resObj.refreshToken = tokens.refreshToken;

            // store refreshToken in Redis or Mongo
            const obj2 = {
                filter: { _id: user._id },
                update: { refreshToken: tokens.refreshToken }
            }
            const response2 = await AdminRepository.update(obj2);
            if (response2.modifiedCount == 0) {
                resObj.refreshTokenSaved = false;
                return resObj;
            }

            return resObj;
        } catch (error) {
            console.log('AdminService.login:: ' + error);
        }
    }

    static async createAccessToken(userObj) {
        try {
            const accessToken = jwt.sign(userObj, ACCESS_TOKEN_SECRET, { expiresIn: `${ACCESS_TOKEN_EXPIRATION}s` })
            const refreshToken = jwt.sign(userObj, REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRATION}s` })

            return { accessToken: accessToken, refreshToken: refreshToken };
        } catch (error) {
            return false
        }
    }



}