import RecordRepository from "../../repository/RecordRepository.js";
import UserRepository from "../../repository/UserRepository.js";


export default class AdminController {
  constructor() { }

  static async charts(req, res, next) {
    try {
      const { param } = req.body;

      var paramId = '$' + param

      const obj = [
        {
          $group: {
            _id: paramId, // Group documents by bodytype
            count: { $sum: 1 } // Count documents in each group
          }
        },
        {
          $sort: { _id: 1 } // Sort by group names in ascending order
        }
      ]
      const result = await RecordRepository.aggregateFcn(obj);
      console.log(result)

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }

  static async incompleteUsers(req, res, next) {
    try {
      const obj =
      {
        filter: {
          $or: [
            { nameEn: { $exists: false } },
            { nameEn: '' }
          ]
        },
        select: '-password'
      }

      const result = await UserRepository.getAll(obj);

      res.json(result)
    } catch (error) {
      res.status(500).json()
    }
  }
}
