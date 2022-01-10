import Post from '../../models/Post.js'


const createPost = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body
    const { _id } = req.user

    const post = new Post({ imageUrl, caption, creatorId: _id })

    const errors = post.validateSync()

    if (errors) {
      return res.status(400).json({ message: 'Invalid inputs', errors: errors.errors })
    }

    try {
      await post.save()
    } catch (e) {
      return res.status(500).json({ message: 'Cannot save post' })
    }

    return res.status(202).json({ post })

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default createPost
