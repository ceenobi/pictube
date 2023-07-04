import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  addComment,
  getComments,
  deleteComment,
} from '../controllers/comments.js'

const router = express.Router()

// post
router.post('/', verifyToken, addComment)
//get
router.get('/:pinId', getComments)
//delete
router.delete('/:pinId/:commentId', verifyToken, deleteComment)

export default router
