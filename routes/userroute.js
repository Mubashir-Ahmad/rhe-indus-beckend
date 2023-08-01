import express from 'express';
import UserController from '../controller/userController.js';
import { isauthenticated, authorizrRoles, Isauthenticated,iSauthenticated,ISauthenticated,ISAuthenticated,ISAUthenticated ,x } from '../middleware/auth.js';

const router = express.Router();

console.log(x);

// import upload from '../middleware/multer.js'; // Import the multer middleware

// Register user
router.post('/register', UserController.userRegister);


// Admin Register user
router.post('/admin/register', UserController.adminuserregister);

// Login user
router.post('/login', UserController.loginuser);

// User Logout
router.get('/logout', UserController.logout);

// Forget password
router.post('/password/forget', UserController.forgetpassword);

// Reset password
router.put('/password/reset/:token', UserController.resetpassword);

// Get user detail
router.get('/me', iSauthenticated,  UserController.getuserdetail);

// User update password
router.put('/password/update', Isauthenticated, UserController.updatepassword);

// User profile update
router.put('/me/update', iSauthenticated, UserController.updateprofile);

// Get all user detail -- Admin
router.get('/admin/user', UserController.getalluser);

// Update user ----Admin
router.put('/update/user/:id', UserController.updateUserRole);


// Get single user detail
router.get('/admin/user/:id', isauthenticated, authorizrRoles('admin'), UserController.getsingleuser);

// Delete user
router.delete('/admin/user/:id',  authorizrRoles('admin'),UserController.deleteuser);

export default router;
