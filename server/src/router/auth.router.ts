import { Router } from 'express'
import { loginUser, registeruser } from '../controllers/contoller.auth';


export const router = Router();

router.post("/register", registeruser);
router.post('/login',loginUser)

