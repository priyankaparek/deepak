import express from 'express';
import { confirmPasswordByOtp, deleteProfile, forgetPassword, getAllUser, getUser, login, logout, profileUpdate, resetPassword, updatePrfilePic, userRegistration, verify, verifyOtp} from '../controllers/userController.js';
import { authorized, findRole } from '../middlewares/auth.js';
import upload from '../middlewares/fileImage.js';
const router = express.Router();

// Public Routes
router.post('/register',upload.single('photo'), userRegistration) //done
router.get('/allUsers', findRole,authorized("admin"), getAllUser)
router.post('/login', login)//done
router.get('/getuser',verify, getUser)//done
router.get('/logout',verify,logout)//done
router.post('/forgotPassword', forgetPassword);
router.post('/password/reset',verify, resetPassword);
router.post('/verifyOtp',verifyOtp);
router.post('/confirmPassword',confirmPasswordByOtp );
router.delete('/deleteProfile/:id',findRole,authorized("admin"), deleteProfile);
router.put('/profileUpdate', verify, profileUpdate);//done
router.post('/updatePic', upload.single('photo'), verify,updatePrfilePic)

//Protected Routes


export default router


