import express from 'express'
import {
  createPin,
  deletePin,
  dislikePin,
  getPinDetail,
  getPins,
  getPinsBySearchOrTags,
  getPinsByTag,
  getUserLikedPins,
  getUserProfileAndPins,
  likePin,
  sendPinsToDB,
} from '../controllers/pins.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// post
router.post('/postdata', sendPinsToDB)
router.post('/create-pin', verifyToken, createPin)

//get
router.get('/pins', getPins)
router.get('/pin-detail/:id', getPinDetail)
router.get('/user/:username', verifyToken, getUserProfileAndPins)
router.get('/search', getPinsBySearchOrTags)
router.get('/tags', getPinsByTag)
router.get('/userliked', verifyToken, getUserLikedPins)

//put
router.put('/:pinId/like', verifyToken, likePin)
router.put('/:pinId/dislike', verifyToken, dislikePin)

//delete
router.delete('/:pinId', verifyToken, deletePin)

export default router
