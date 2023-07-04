import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pinId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const Comment =
  mongoose.models.Comment || mongoose.model('Comment', CommentSchema)

export default Comment
