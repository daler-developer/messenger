import Message from '../../models/Message.js'


const getMessages = async (req, res) => {
  try {
    const { communicators } = req.query

    const messages = await Message.find({ senderId: { $in: communicators }, receiverId: { $in: communicators } })

    return res.status(200).json({ messages })

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default getMessages
