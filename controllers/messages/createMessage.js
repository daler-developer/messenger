import Message from '../../models/Message.js'


const createMessage = async (req, res) => {
  try {
    const { receiverId, text, imageUrl } = req.body
    const senderId = req.user._id

    const message = new Message({ receiverId, senderId, text, imageUrl })

    try {
      message.validateSync()
    } catch (e) {
      return res.status(400).status({ message: 'Invalid inputs', errors: e })
    }

    try {
      await message.save()
    } catch (e) {
      return res.status(500).status({ message: 'Cannot save message', errors: e })
    }

    return res.status(202).json({ message })

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default createMessage
