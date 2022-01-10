import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  username: {
    type: 'string',
    required: true,
    unique: true
  },
  password: {
    type: 'string',
    required: true
  },
  displayName: {
    type: 'string',
    required: [true, 'display name is required']
  },
  avatarUrl: {
    type: 'string',
    required: false
  },
  bio: {
    type: 'string',
    required: false
  }
})

const User = mongoose.model('User', userSchema)

export default User
