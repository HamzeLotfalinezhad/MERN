import User from "../models/User.js";

export default class UserRepository {

    static async getAll(obj = {}) {
        try {
            return await User.find(obj.filter, obj.select, obj.option)
        } catch (error) {
            console.log('UserRepository.getAllUsers:: ' + error)
        }
    }

    static async getOne(obj = {}) {
        try {
            return await User.findOne(obj.filter, obj.select, obj.option)
        } catch (error) {
            console.log('UserRepository.getAllUsers:: ' + error)
        }
    }

    static async getbyId(obj = {}) {
        try {
            return await User.findById(obj.id, obj.select, obj.option);
        } catch (error) {
            console.log('UserRepository.getbyId:: ' + error)
        }
    }

    static async create(obj) {
        try {
            return await new User(obj).save();
        } catch (error) {
            console.log('UserRepository.create:: ' + error)
        }
    }

    static async update(obj = {}) {
        try {
            const result = await User.updateOne(obj.filter, obj.update, obj.option);
            if (result.modifiedCount == 0) return false
            return true
        } catch (error) {
            console.log('UserRepository.updateOne:: ' + error)
        }
    }

    static async delete(filter) {
        try {
            const result = await User.deleteOne(filter)
            if (result.deletedCount == 0) return false
            return true
        } catch (error) {
            console.log('UserRepository.delete:: ' + error)
        }
    }

    static async getAllPopulate(obj = {}) {
        try {
            return await User.find(obj.filter, obj.select, obj.option)
                .populate(obj.population)
                .sort(obj.sort)
        } catch (error) {
            console.log('UserRepository.getAllUsers:: ' + error)
        }
    }

    static async getOnePopulate(obj = {}) {
        try {
            return await User.findOne(obj.filter, obj.select, obj.option).populate(obj.population)
        } catch (error) {
            console.log('UserRepository.getAllUsers:: ' + error)
        }
    }

    static async getbyIdPopulate(obj = {}) {
        try {
            return await User.findById(obj.id, obj.select, obj.option).populate(obj.population);
        } catch (error) {
            console.log('UserRepository.getbyId:: ' + error)
        }
    }

    static async aggregateFcn(obj) {
        try {
            return await User.aggregate(obj);
        } catch (error) {
            console.log('UserRepository.aggregateFcn:: ' + error)
        }
    }
}

// export default UserRepository;