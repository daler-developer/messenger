import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import User from '../../models/User.js'


const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (user) {
      const matches = bcryptjs.compareSync(password, user.password)
      
      if (!matches) {
        return res.status(400).json({ message: 'Wrong password' })
      }

      const token = jwt.sign({ username: user.username }, 'jwt_secret', { expiresIn: '2 days' })

      return res.status(200).json({ user, token })
    }

    return res.status(404).json({ message: 'User does not exist!' })

  } catch (e) {

    return res.status(500).json({ message: 'Unknown error' })

  }
}

export default login
