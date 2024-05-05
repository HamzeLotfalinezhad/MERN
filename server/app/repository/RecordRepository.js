import Record from "../models/Record.js";

export default class RecordRepository {

    static async getAll(obj = {}) {
        try {
            return await Record.find(obj.filter, obj.select, obj.option)
        } catch (error) {
            console.log('RecordRepository.getAllRecords:: ' + error)
        }
    }

    static async getOne(obj = {}) {
        try {
            return await Record.findOne(obj.filter, obj.select, obj.option)
        } catch (error) {
            console.log('RecordRepository.getAllRecords:: ' + error)
        }
    }

    static async getbyId(obj = {}) {
        try {
            return await Record.findById(obj.id, obj.select, obj.option);
        } catch (error) {
            console.log('RecordRepository.getbyId:: ' + error)
        }
    }

    static async create(obj) {
        try {
            return await new Record(obj).save();
        } catch (error) {
            console.log('RecordRepository.create:: ' + error)
        }
    }

    static async update(obj = {}) {
        try {
            const result =  await Record.updateOne(obj.filter, obj.update, obj.option);
            if (result.modifiedCount == 0) return false
            return true
        } catch (error) {
            console.log('RecordRepository.updateOne:: ' + error)
        }
    }

    static async delete(filter) {
        try {
            const result = await Record.deleteOne(filter)
            if (result.deletedCount == 0) return false
            return true
        } catch (error) {
            console.log('RecordRepository.delete:: ' + error)
        }
    }

    static async getAllPopulate(obj = {}) {
        try {
            return await Record.find(obj.filter, obj.select, obj.option)
                .populate(obj.population)
                .sort(obj.sort)
        } catch (error) {
            console.log('RecordRepository.getAllRecords:: ' + error)
        }
    }

    static async getOnePopulate(obj = {}) {
        try {
            return await Record.findOne(obj.filter, obj.select, obj.option).populate(obj.population)
        } catch (error) {
            console.log('RecordRepository.getAllRecords:: ' + error)
        }
    }

    static async getbyIdPopulate(obj = {}) {
        try {
            return await Record.findById(obj.id, obj.select, obj.option).populate(obj.population);
        } catch (error) {
            console.log('RecordRepository.getbyId:: ' + error)
        }
    }

    static async aggregateFcn(obj) {
        try {
            return await Record.aggregate(obj);
        } catch (error) {
            console.log('RecordRepository.aggregateFcn:: ' + error)
        }
    }
}

// export default RecordRepository;