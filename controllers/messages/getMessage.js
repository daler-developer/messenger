import Message from '../../models/Message.js'


const getMessage = async (req, res) => {
  try {
    const { _id } = req.params

    const message = await Message.findOne({ _id })

    if (message) {
      return res.status(200).json({ message })
    }

    return res.status(404).json({ message: 'Message not found' })

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default getMessage
