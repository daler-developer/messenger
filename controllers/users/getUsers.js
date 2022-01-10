import User from '../../models/User.js'


const getUsers = async (req, res) => {
  try {
    const { excludeCurrent, limit, exclude } = req.query
    const { _id } = req.user

    const users = User.find()

    if (excludeCurrent) { 
      users.where('_id').ne(_id)
    }

    if (exclude) {
      users.where('_id').nin(exclude)
    }

    if (limit) {
      users.limit(limit)
    }

    users.exec((errors, result) => {
      if (errors) {
        return res.status(500).json({ message: 'Cannot get users', errors })
      }

      return res.status(200).json({ users: result })
    })

  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default getUsers
