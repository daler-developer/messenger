import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import User from '../../models/User.js'


const register = async (req, res) => {
  try {
    const { username, password, displayName } = req.body

    const candidate = await User.findOne({ username })

    if (candidate) {
      return res.status(500).json({ message: 'User already exists' })
    }

    const hashed = bcryptjs.hashSync(password, 10)

    const user = new User({ username, password: hashed, displayName })

    const errors = user.validateSync()

    if (errors) {
      return res.status(400).json({ message: 'Invalid values', errors })
    }

    try {
      await user.save()
      
    } catch (e) {
      return res.status(500).json({ message: 'Cannot create new user' }) 
    }


    const token = jwt.sign({ username: user.username }, 'jwt_secret', { expiresIn: '2 days' })

    return res.status(201).json({ user, token })

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default register
