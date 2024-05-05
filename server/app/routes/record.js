import { Router } from 'express';
const router = Router();
import { implantFailureFromCheck } from '../middleware/validation/userValidation.js';
import RecordController from "../controllers/user/RecordController.js";
import authToken from '../middleware/authToken.js';
import checkRole from '../middleware/checkRole.js';

const A = ['admin']
const U = ['user']
const M = ['manager']
const C = ['coordinator']
const MC = ['manager', 'coordinator']
const MU = ['manager', 'user']

router.post('/add', authToken, checkRole(U), implantFailureFromCheck, RecordController.add);
router.get('/getAll', authToken, checkRole(U), RecordController.getAll);

router.post('/update', authToken, implantFailureFromCheck, checkRole(MU), RecordController.update);
router.get('/getALlRecent', authToken, checkRole(MC), RecordController.getAllRecent);
router.post('/verifyRecord', authToken, checkRole(M), RecordController.verifyRecord);
router.post('/receivedRecord', authToken, checkRole(C), RecordController.receivedRecord);

router.get('/searchUser', authToken, checkRole(M), RecordController.searchUser);
router.post('/getUser', authToken, checkRole(M), RecordController.getUser);
router.post('/editUserKeyValue', authToken, checkRole(M), RecordController.EditUserKeyValue);

router.get('/searchAdmin', authToken, checkRole(A), RecordController.searchAdmin);
router.post('/getAdmin', authToken, checkRole(A), RecordController.getAdmin);
router.post('/editAdminKeyValue', authToken, checkRole(A), RecordController.EditAdminKeyValue);

router.post('/getUserRecords', authToken, checkRole(M), RecordController.getUserRecords);
router.delete('/delete', authToken, checkRole(U), RecordController.delete);

router.get('/records', authToken, checkRole(A), RecordController.records);


export default router;