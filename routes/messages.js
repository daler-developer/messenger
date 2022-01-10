import express from "express"
import validator from 'express-validator'

import validation from '../middleware/validation.js'
import auth from '../middleware/auth.js'

import createMessage from "../controllers/messages/createMessage.js"
import getMessages from "../controllers/messages/getMessages.js"
import getMessage from "../controllers/messages/getMessage.js"


const router = new express.Router()

router.post(
  '/',
  [auth],
  [
    validator.body('receiverId')
      .exists().withMessage('receiverId not given').bail()
      .trim().notEmpty().withMessage('receiverId is empty').bail()
    ,
    validator.body('text')
      .exists().withMessage('text not given').bail()
      .trim().notEmpty().withMessage('text is empty').bail()
    ,
    validator.body('imageUrl')
      .if(validator.body('imageUrl').exists())
      .trim().notEmpty().withMessage('text is empty').bail()
    ,
  ],
  [validation],
  createMessage
)

router.get(
  '/',
  [auth],
  [
    validator.query('communicatorId')
      .exists().withMessage('receiverId not given').bail()
      .isString()
  ],
  [validation],
  getMessages
)

router.get(
  '/:_id',
  [auth],
  [],
  getMessage
)

export default router
