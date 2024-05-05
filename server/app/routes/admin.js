import { Router } from 'express';
const router = Router();
import { loginCheck, registerCheck } from '../middleware/validation/userValidation.js';
import LoginController from "../controllers/admin/LoginController.js";
import TokenController from '../controllers/TokenController.js';
import AdminController from '../controllers/admin/AdminController.js';
import authToken from '../middleware/authToken.js';
import checkRole from '../middleware/checkRole.js';
import limiter from '../middleware/limiter.js';

const A = ['admin']
const U = ['user']
const M = ['manager']
const C = ['coordinator']
const MC = ['manager', 'coordinator']
const MU = ['manager', 'user']

router.post('/register', registerCheck, limiter, LoginController.register);
router.post('/login', loginCheck, limiter, LoginController.login);
router.get('/logout', TokenController.logout);
router.post('/confirmPass', authToken, checkRole(A), limiter, LoginController.confirmPass);
router.delete('/deleteRecord', authToken, checkRole(M), limiter, LoginController.deleteRecord);
router.post('/charts', authToken, checkRole(M), AdminController.charts);
router.get('/incompleteUsers', authToken, checkRole(M), AdminController.incompleteUsers);

export default router;