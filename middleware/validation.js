import validator from 'express-validator'


const validation = (req, res, next) => {
  try {
    const errors = validator.validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid inputs', errors: errors.errors })
    }

    return next()

  } catch (e) {
    return res.status(500).json({ message: 'Unknown error' })
  }
}

export default validation
