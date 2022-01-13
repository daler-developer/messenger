import User from '../../models/User.js'


const getUser = async (req, res) => {
  try {
    const { _id } = req.params

    const user = await User.findOne({ _id })

    if (user) {
      return res.status(200).json({ user })
    }

    return res.status(404).json({ message: 'User not found' })

  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default getUser
