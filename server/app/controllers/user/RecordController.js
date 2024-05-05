
import { validationResult } from "express-validator";
import RecordRepository from "../../repository/RecordRepository.js";
import UserRepository from "../../repository/UserRepository.js";
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs';
import AdminRepository from "../../repository/AdminRepository.js";

export default class RecordController {
  constructor() { }

  static async add(req, res, next) {
    try {
      const form = req.body;

      // Replace html with /
      form.insertDate = form.insertDate.replace(/&#x2F;/g, '/')
      form.removeDate = form.removeDate.replace(/&#x2F;/g, '/')

      const errors = validationResult(req).array('msg')
      if (errors.length > 0) return res.status(202).json({ msg: '', 'errors': errors })

      const result = await RecordRepository.create(form)
      if (!result) return res.status(202).json()

      res.status(201).json({ recordId: result.recordId })
    } catch (error) {
      res.status(500).json()
    }
  }

  static async update(req, res, next) {
    try {
      const form = req.body;

      // Replace html with /
      form.insertDate = form.insertDate.replace(/&#x2F;/g, '/')
      form.removeDate = form.removeDate.replace(/&#x2F;/g, '/')

      const errors = validationResult(req).array('msg')
      if (errors.length > 0) return res.status(202).json({ msg: '', 'errors': errors })

      const _id = form._id
      const user = form.user

      delete form._id
      delete form.user

      const obj = {
        filter: { _id: _id, user: user, isVerified: false },
        update: form
      }

      const response = await RecordRepository.update(obj)
      if (!response) return res.status(202).json()

      res.status(204).json()
    } catch (error) {
      res.status(500).json()
    }
  }

  static async getAll(req, res, next) {
    try {
      const user = req.user

      const { page, pageSize } = req.query;
      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);

      const obj = {
        filter: { user: new ObjectId(user._id) },
        select: "-password",
        option: { sort: { createdAt: -1 }, skip: offset, limit: limit }
      }
      const result = await RecordRepository.getAll(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async getAllRecent(req, res, next) {
    try {
      const user = req.user
      const { page, pageSize } = req.query;
      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);

      console.log(user);
      var fobj = {}
      if (user.role === 'manager') fobj = { isVerified: false, isReceived: true }
      if (user.role === 'coordinator') fobj = { isReceived: false }

      const obj = {
        filter: fobj,
        population: { path: "user", model: 'User', select: '-password', },
        option: { sort: { createdAt: -1 }, skip: offset, limit: limit }
      }
      const result = await RecordRepository.getAllPopulate(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async searchUser(req, res, next) {
    try {
      const search = req.query

      var searchText = search.search.trim()
      if (searchText == '') return

      const obj = {
        filter: { name: { $regex: '.*' + searchText + '.*' } },
        select: '_id name',
        option: { limit: 5 }
      }
      // const result = await User.find({ 'name': { "$regex": search, "$options": "i" } }, '_id name').limit(10)
      const result = await UserRepository.getAll(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async searchAdmin(req, res, next) {
    try {
      const search = req.query

      var searchText = search.search.trim()
      if (searchText == '') return

      const obj = {
        filter: { name: { $regex: '.*' + searchText + '.*' } },
        select: '_id name',
        option: { limit: 5 }
      }
      // const result = await User.find({ 'name': { "$regex": search, "$options": "i" } }, '_id name').limit(10)
      const result = await AdminRepository.getAll(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async getUserRecords(req, res, next) {
    try {
      const { _id, page, pageSize } = req.body

      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);

      const obj = {
        filter: { user: new ObjectId(_id) },
        population: { path: "user", model: 'User', select: '-password', },
        option: { sort: { createdAt: -1 }, skip: offset, limit: limit }
      }
      const result = await RecordRepository.getAllPopulate(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async verifyRecord(req, res, next) {
    try {
      // const user = req.user
      const { _id, isVerified } = req.body

      const obj = {
        filter: { _id: new ObjectId(_id), isVerified: false, isReceived: true },
        update: { isVerified: isVerified },
      }
      const response = await RecordRepository.update(obj);
      if (!response) return res.status(202).json()

      res.status(204).json()
    } catch (error) {
      res.status(500).json()
    }
  }

  static async receivedRecord(req, res, next) {
    try {
      // const user = req.user
      const { _id, isReceived } = req.body

      const obj = {
        filter: { _id: new ObjectId(_id), isReceived: false },
        update: { isReceived: isReceived },
      }
      const response = await RecordRepository.update(obj);
      if (!response) return res.status(202).json()

      res.status(204).json()
    } catch (error) {
      res.status(500).json()
    }
  }

  static async getUser(req, res, next) {
    try {
      const { _id } = req.body

      const response = await UserRepository.getOne({ filter: { _id: new ObjectId(_id) }, select: "-password" })

      res.json(response)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async getAdmin(req, res, next) {
    try {
      const { _id } = req.body

      const response = await AdminRepository.getOne({ filter: { _id: new ObjectId(_id) }, select: "-password" })

      res.json(response)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async delete(req, res, next) {
    try {
      const { _id } = req.body
      const user = req.user

      const response = await RecordRepository.delete({
        _id: new ObjectId(_id),
        user: new ObjectId(user._id),
        isReceived: false
      })
      if (!response) return res.status(202).json()

      res.status(204).json(response)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async EditUserKeyValue(req, res, next) {
    try {
      var { _id, key, value } = req.body

      value = value.trim()
      if (value === '') return res.status(202).json()
      if (key === 'password') {
        value = await bcrypt.hash(value, 10)
      }

      const obj2 = {
        filter: { _id: new ObjectId(_id) },
        update: { [key]: value },
        option: { new: true }
      }
      const response = await UserRepository.update(obj2)
      if (!response) return res.status(202).json()

      res.status(204).json(response)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async EditAdminKeyValue(req, res, next) {
    try {
      var { _id, key, value } = req.body

      value = value.trim()
      if (value === '') return res.status(202).json()
      if (key === 'password') {
        value = await bcrypt.hash(value, 10)
      }

      const obj2 = {
        filter: { _id: new ObjectId(_id) },
        update: { [key]: value },
        option: { new: true }
      }
      const response = await AdminRepository.update(obj2)
      if (!response) return res.status(202).json()

      res.status(204).json(response)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async records(req, res, next) {
    try {
      const { date1, date2 } = req.query

      // Define your two date variables
      const startDate = new Date(date1);
      const endDate = new Date(date2);

      const obj = {
        filter: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        },
        population: { path: "user", model: 'User', select: '-password -_id', },
        option: { sort: { createdAt: 1 } }
      }
      // const result = await User.find({ 'name': { "$regex": search, "$options": "i" } }, '_id name').limit(10)
      const result = await RecordRepository.getAllPopulate(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

}
