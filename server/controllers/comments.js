// import { customError } from '../config/error.js'
import Comment from '../models/comment.js'
import Pin from '../models/pin.js'

export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, userId: req.user.id })
    const savedComment = await newComment.save()
    res.status(200).json(savedComment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ pinId: req.params.pinId }).sort({
      _id: -1,
    })
    res.status(200).json(comments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const pin = await Pin.findByIdAndUpdate(
      req.params.pinId,
      {
        $pull: { comments: req.params.commentId },
      },
      { new: true }
    )
    if (!pin) {
      return res.status(400).json('Pin not found')
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.json('Success')
  } catch (err) {
    res.status(500).json('Something went wrong')
  }
}
