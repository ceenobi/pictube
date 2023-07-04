// import { v2 as cloudinary } from 'cloudinary'
import { customError } from '../config/error.js'
import data from '../config/sampledata.js'
import Pin from '../models/pin.js'
import User from '../models/user.js'

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
// })

export const sendPinsToDB = async (req, res, next) => {
  try {
    await Pin.deleteMany({})
    const pins = await Pin.insertMany(data.pins)
    res.send({ pins })
  } catch (err) {
    next(err)
  }
}

export const getPins = async (req, res, next) => {
  try {
    const pins = await Pin.find().sort({ _id: -1 })
    if (!pins) return next(customError(404, "Can't find pins!"))
    res.status(200).json(pins)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
export const createPin = async (req, res) => {
  try {
    const { userId, title, tags, description, image } = req.body
    const user = await User.findById(userId)
    const newPin = await Pin.create({
      userId,
      title,
      tags,
      description,
      image,
      userImg: user.image,
      username: user.username,
      likes: [],
    })
    res.status(201).json({ success: true, data: newPin })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getPinDetail = async (req, res, next) => {
  try {
    const pin = await Pin.findOne({ _id: req.params.id })
    if (!pin) return next(customError(404, "Can't find pin!"))
    res.status(200).json(pin)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const likePin = async (req, res, next) => {
  const id = req.user.id
  const pinId = req.params.pinId
  try {
    await Pin.findByIdAndUpdate(pinId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    })
    res.status(200).json('Pin liked')
  } catch (err) {
    next(err)
  }
}

export const dislikePin = async (req, res, next) => {
  const id = req.user.id
  const pinId = req.params.pinId
  try {
    await Pin.findByIdAndUpdate(pinId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    })
    res.status(200).json('Pin disliked.')
  } catch (err) {
    next(err)
  }
}

export const getUserProfileAndPins = async (req, res, next) => {
  const { username } = req.params
  const id = req.user.id
  try {
    const user = await User.findOne({ username })
    if (!user) return next(customError(500, "Can't find user"))
    const { password, ...rest } = user._doc
    if (user) {
      const pin = await Pin.find({ username: req.params.username })
      const likedPins = await Pin.find({ likes: id })
      const userProfile = { ...rest, pin, likedPins }
      res.status(200).json(userProfile)
    } else {
      return next(customError(401, 'Could not fetch related info about user'))
    }
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getPinsBySearchOrTags = async (req, res) => {
  const query = req.query.q
  const tags = req.query.q?.split(' , ')
  try {
    const result = await Pin.find({
      title: { $regex: query, $options: 'i' },
    }).limit(20)
    const pins = await Pin.find({ tags: { $in: tags } })
    res.status(200).json(result.concat(pins))
  } catch (err) {
    res.status(400).json(err)
  }
}

export const getPinsByTag = async (req, res, next) => {
  const tags = req.query.tags?.split(' , ')
  try {
    const pins = await Pin.find({ tags: { $in: tags } }).limit(20)
    res.status(200).json(pins)
  } catch (err) {
    next(err)
  }
}

export const getUserLikedPins = async (req, res) => {
  try {
    const userId = await User.findById(req.user.id)
    const userLikedPins = await Pin.find({ likes: userId })
    const ll = await Pin.find({ likes: userLikedPins })
    res.status(200).json(ll)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const deletePin = async (req, res) => {
  try {
    const userId = await User.findById(req.user.id)
    const pin = await Pin.find({ userId: userId })
    if (pin) {
      await Pin.findByIdAndDelete(req.params.pinId)
      res.status(200).json('Pin deleted successfully')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

