import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default() {
      return new Date()
    }
  },
  text: {
    type: String,
    required: [true, 'text is empty']
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'senderId is required']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'receiver id is required']
  },
  imageUrl: {
    type: 'string',
    required: false
  }
})

const Message = mongoose.model('Message', messageSchema)

export default Message
