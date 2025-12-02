import express from 'express';
import { login, logout, register, sendVerifyOtp, verifyEmail, isAuthenticated, SendPasswordResetOtp, passwordReset } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';



const authRouter = express.Router();

authRouter.post('/signup',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-pass-reset-otp',SendPasswordResetOtp);
authRouter.post('/reset-password',passwordReset);

export default authRouter;
