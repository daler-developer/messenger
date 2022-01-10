import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
  caption: {
    type: 'string',
    required: [true, 'caption is required']
  },
  imageUrl: {
    type: 'string',
    required: [true, 'image url is required']
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'creator is required']
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: []
  },
  comments: {
    type: [{
      userId: mongoose.Schema.Types.ObjectId,
      text: 'string'
    }],
    required: false,
    default: []
  }
})

const Post = mongoose.model('Post', postSchema)

export default Post
