import express from 'express'
import {
  registerUser,
  loginUser,
  verifyUser,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  authenticateUser,
  decodeUserId,
} from '../controllers/authUsers.js'
import { localVariables, verifyToken } from '../middleware/auth.js'
import { registerMail } from '../controllers/mail.js'

const router = express.Router()

// post
router.post('/register', registerUser)
router.post('/registerMail', registerMail)
router.post('/authenticate', verifyUser, authenticateUser)
router.post('/login', verifyUser, loginUser)

//get
router.get('/user/:username', getUser)
router.get('/user/profile/:username', verifyToken, getUser)
router.get('/decodeId/:id', decodeUserId)
router.get('/generateOTP', verifyUser, localVariables, generateOTP)
router.get('/verifyOTP', verifyUser, verifyOTP)
router.get('/createResetSession', createResetSession)

//update
router.put('/updateuser', verifyToken, updateUser)
router.put('/resetPassword', verifyUser, resetPassword)

export default router
