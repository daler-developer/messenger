import User from '../../models/User.js'


const updateUser = async (req, res) => {
  try {
    const body = req.body
    const { _id } = req.user

    await User.updateOne({ _id }, { ...body } )

    const updatedUser = await User.findOne({ _id })

    return res.status(200).json({ user: updatedUser })

  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default updateUser
