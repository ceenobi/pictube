import mongoose from 'mongoose'

const PinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userImg: String,
    username: String,
    image: {
      type: [String],
      required: [true, 'Image is required.'],
    },
    tags: {
      type: [String],
    },
    title: {
      type: String,
      required: [true, 'Title is required.'],
      max: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      max: 300,
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Pin = mongoose.models.Pin || mongoose.model('Pin', PinSchema)

export default Pin
