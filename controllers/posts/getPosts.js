import Post from '../../models/Post.js'


const getPosts = async (req, res) => {
  try {
    const { limit, exclude } = req.query
    const {} = req.params

    const posts = Post.find()

    if (limit) {
      posts.limit(limit)
    }

    if (exclude) {
      posts.where('_id').nin(exclude)
    }

    posts.exec((errors, result) => {
      console.log(errors)
      if (errors) {
        return res.status(500).json({ message: 'Cannot send posts', errors })
      }

      return res.status(200).json({ posts: result })
    })

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default getPosts
