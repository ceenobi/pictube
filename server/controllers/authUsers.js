import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import { customError } from '../config/error.js'
import generateToken from '../config/token.js'
import User from '../models/user.js'

/** middleware for verified user */
export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body
    // check if user exists
    let exist = await User.findOne({ username })
    if (!exist) return next(customError(404, "Can't find user!"))
    next()
  } catch (err) {
    return res.status(404).json({ err: 'Authentication Error' })
  }
}

export const authenticateUser = async (req, res) => {
  res.end()
}

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, image, password, bio } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return next(customError(404, 'User already exists'))
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser = await User.create({
      username,
      email,
      image:
        image ||
        'https://res.cloudinary.com/ceenobi/image/upload/v1687743800/icon-256x256_d7vo98.png',
      password: passwordHash,
      bio: bio || 'Nothing yet, edit profile to update bio.',
    })
    const access_token = generateToken(newUser._id)
    const user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      image: newUser.image,
      bio: newUser.bio,
    }
    res
      .status(201)
      .json({ access_token, user, msg: 'User registration successfull' })
  } catch (err) {
    res.status(500).json(err)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { username } = req.body
    const userExists = await User.findOne({ username })
    if (!userExists) return next(customError(400, 'User does not exist'))
    const isMatch = await bcrypt.compare(req.body.password, userExists.password)
    if (!isMatch) return next(customError(400, 'Invalid credentials. '))
    const access_token = generateToken(userExists._id)
    const { password, ...user } = userExists._doc
    res.status(200).json({ access_token, user, msg: 'Login Successfull' })
  } catch (err) {
    next(customError(500, err.message))
  }
}

export const getUser = async (req, res, next) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ username })
    if (!user) return next(customError(500, "Can't find user"))
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
export const decodeUserId = async (req, res, next) => {
  const id = req.params.id
  try {
    const user = await User.findById({ _id: id })
    if (!user) return next(customError(500, "Can't find user"))
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const userId = await User.findById(req.user.id)
    if (userId) {
      userId.username = req.body.username || userId.username
      userId.email = req.body.email || userId.email
      userId.image = req.body.image || userId.image
      userId.bio = req.body.bio || userId.bio
      const updatedUser = await userId.save()
      const user = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
        bio: updatedUser.bio,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
      }
      const access_token = generateToken(updatedUser._id)
      res.status(201).json({
        access_token,
        user,
        msg: 'User profile updated!',
      })
    } else {
      res.status(404)
      throw new Error('User profile not updated')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })
  res.status(201).json({ code: req.app.locals.OTP })
}

export const verifyOTP = async (req, res) => {
  const { code } = req.query
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null // reset the OTP value
    req.app.locals.resetSession = true // start session for reset password
    return res.status(201).json({ msg: 'Verified Successsfully!' })
  }
  return res.status(400).json({ error: 'Invalid OTP' })
}

export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).json({ flag: req.app.locals.resetSession })
  }
  return res.status(440).json({ error: 'Session expired!' })
}

export const resetPassword = async (req, res, next) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).json({ error: 'Session expired!' })
    const { username, password } = req.body
    try {
      const findUser = User.findOne({ username })
      if (!findUser) return next(customError(404, 'User not found'))
      if (findUser) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatePassword = await User.updateOne(
          { username },
          { password: hashedPassword }
        )
        req.app.locals.resetSession = false
        return res
          .status(201)
          .json({ updatePassword, msg: 'Password Updated...!' })
      } else {
        return next(customError(500, 'Unable to hash password'))
      }
    } catch (err) {
      next(customError(500, err.message))
    }
  } catch (err) {
    res.status(404).json({ err })
  }
}
