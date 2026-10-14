import { Router } from 'express'
import { loginUser, registerUser } from '../controllers/contoller.auth';


export const authrouter = Router();

authrouter.post("/register", registerUser);
authrouter.post('/login',loginUser)



