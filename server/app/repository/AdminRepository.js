import Admin from "../models/Admin.js";

export default class AdminRepository {

    static async getAll(obj = {}) {
        try {
            return await Admin.find(obj.filter, obj.select, obj.option)
        } catch (error) {
            console.log('AdminRepository.getAllAdmins:: ' + error)
        }
    }

    static async getOne(obj = {}) {
        try {
            return await Admin.findOne(obj.filter, obj.select, obj.option)
        } catch (error) {
            console.log('AdminRepository.getAllAdmins:: ' + error)
        }
    }

    static async getbyId(obj = {}) {
        try {
            return await Admin.findById(obj.id, obj.select, obj.option);
        } catch (error) {
            console.log('AdminRepository.getbyId:: ' + error)
        }
    }

    static async create(obj) {
        try {
            return await new Admin(obj).save();
        } catch (error) {
            console.log('AdminRepository.create:: ' + error)
        }
    }

    static async update(obj = {}) {
        try {
            const result = await Admin.updateOne(obj.filter, obj.update, obj.option);
            if (result.modifiedCount == 0) return false
            return true
        } catch (error) {
            console.log('AdminRepository.updateOne:: ' + error)
        }
    }

    static async delete(filter) {
        try {
            const result = await Admin.deleteOne(filter)
            if (result.deletedCount == 0) return false
        } catch (error) {
            console.log('AdminRepository.delete:: ' + error)
        }
    }

    static async getAllPopulate(obj = {}) {
        try {
            return await Admin.find(obj.filter, obj.select, obj.option)
                .populate(obj.population)
                .sort(obj.sort)
        } catch (error) {
            console.log('AdminRepository.getAllAdmins:: ' + error)
        }
    }

    static async getOnePopulate(obj = {}) {
        try {
            return await Admin.findOne(obj.filter, obj.select, obj.option).populate(obj.population)
        } catch (error) {
            console.log('AdminRepository.getAllAdmins:: ' + error)
        }
    }

    static async getbyIdPopulate(obj = {}) {
        try {
            return await Admin.findById(obj.id, obj.select, obj.option).populate(obj.population);
        } catch (error) {
            console.log('AdminRepository.getbyId:: ' + error)
        }
    }

    static async aggregateFcn(obj) {
        try {
            return await Admin.aggregate(obj);
        } catch (error) {
            console.log('AdminRepository.aggregateFcn:: ' + error)
        }
    }
}

// export default AdminRepository;