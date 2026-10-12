import { Router } from 'express'
import { loginUser, registerUser } from '../controllers/contoller.auth';


export const router = Router();

router.post("/register", registerUser);
router.post('/login',loginUser)

