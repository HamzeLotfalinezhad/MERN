// const redis = require('redis');
import { ACCESS_TOKEN_EXPIRATION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET } from "../../../config.js";
import RecordRepository from "../../repository/RecordRepository.js";
import AdminService from "../../services/AdminService.js";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'


export default class LoginController {
  constructor() { }

  static async register(req, res, next) {
    try {
      const { name, password, phone } = req.body;

      // check validation errors
      const errors = validationResult(req).array('msg')
      if (errors.length > 0) return res.status(202).json({ msg: '', 'errors': errors })

      const obj = await AdminService.signin(name, password, phone);

      if (obj.wrongPassRepeat) return res.status(202).json({ msg: 'تکرار رمز عبور اشتباه است' })

      res.status(201).json()
    } catch (error) {
      res.status(500).json()
    }
  }

  static async login(req, res, next) {
    try {
      const { phone, password } = req.body;

      // check validation errors
      const errors = validationResult(req).array('msg')
      if (errors.length > 0) return res.status(202).json({ msg: '', 'errors': errors })

      const obj = await AdminService.login(phone, password);

      if (!obj.userLogin) return res.status(201).json({ msg: 'نام کاربری یا رمز عبور اشتباه است' })
      if (!obj.refreshTokenSaved) return res.status(201).json({ msg: 'خطا در ذخیره سازی توکن' })

      // Set refresh token in a cookie
      res.cookie('refreshToken', obj.refreshToken,
        {
          // path: '/',
          expires: new Date(Date.now() + 1000 * REFRESH_TOKEN_EXPIRATION),
          httpOnly: true,
          // sameSite:"none", 
          // secure: true  // Only if Https
        });

      res.json({
        msg: 'ورود با موفقیت انجام شد',
        accessToken: obj.accessToken,
      })
    } catch (error) {
      res.status(500).json()
    }
  }

  static async refreshAccessToken(req, res, next) {
    try {
      const cookie = req.headers.cookie;
      const user = await LoginController.verify_refresh_token(cookie);
      if (!user) return res.status(401).json({ msg: 'Unauthorized - No token provided' }); // login again

      // refresh access_token
      const userObj = { _id: user._id, name: user.name, role: user.role }
      const access_token_new = jwt.sign(userObj, ACCESS_TOKEN_SECRET, { expiresIn: `${ACCESS_TOKEN_EXPIRATION}s` })

      res.json({
        accessToken: access_token_new,
      })
    } catch (error) {
      res.status(500).json()
    }
  }

  static async verify_refresh_token(cookie) {
    try {
      const token = cookie.split('refreshToken=')[1];
      if (!token) return false;

      return new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) {
            resolve(false);
          } else {
            resolve(user);
          }
        });
      });
    } catch (error) {
      return false
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      res.setHeader('Authorization', '');
      return res.json()
    } catch (error) {
      res.status(500).json()
    }
  }

  static async confirmPass(req, res, next) {
    try {
      const {pass} = req.body
      if(pass !== 'Oimplant') return res.status(202).json()
      return res.json()
    } catch (error) {
      res.status(500).json()
    }
  }

  static async deleteRecord(req, res, next) {
    try {
      const { _id, user } = req.body

      const response = await RecordRepository.delete({
        _id: new ObjectId(_id),
        user: new ObjectId(user),
        isVerified: false,
      })
      if (!response) return res.status(202).json()

      res.status(204).json(response)
    } catch (error) {
      res.status(500).json()
    }
  }

}
