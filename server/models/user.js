import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists!'],
      required: [true, 'Email is required!'],
    },
    username: {
      type: String,
      required: [true, 'Username is required!'],
      unique: true,
      min: 3,
      max: 20,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      min: 5,
      max: 20,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User
