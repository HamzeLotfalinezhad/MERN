// const redis = require('redis');
import { ACCESS_TOKEN_EXPIRATION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET } from "../../config.js";
import jwt from 'jsonwebtoken';
import AdminRepository from "../repository/AdminRepository.js";

export default class TokenController {
  constructor() { }

  static async refreshAccessToken(req, res, next) {
    try {
      const cookie = req.headers.cookie;
      const user = await TokenController.verify_refresh_token(cookie);
      if (!user) return res.status(401).json({ msg: 'Unauthorized - No token provided' }); // login again

      var role = user.role;

      // for admin roles select updated role from db.
      // you can add db='user' or db='admin' parameter to JWT so you know which databse search for role update
      if (role !== 'user') {
        const admin = await AdminRepository.getOne({ filter: { _id: user._id }, select: 'role' });
        role = admin.role
      }
      
      // refresh access_token
      const userObj = { _id: user._id, name: user.name, role: role }
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


}
