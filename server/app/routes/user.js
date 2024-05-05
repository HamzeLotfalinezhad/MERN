import { Router } from 'express';
const router = Router();
import { loginCheck, registerCheck } from '../middleware/validation/userValidation.js';
import LoginController from "../controllers/user/LoginController.js";
import TokenController from '../controllers/TokenController.js';
import limiter from '../middleware/limiter.js';

router.post('/register', registerCheck, limiter, LoginController.register);
router.post('/login', loginCheck, limiter, LoginController.login);
router.post('/refreshAccessToken', TokenController.refreshAccessToken);
router.get('/logout', TokenController.logout);


export default router;