import express from "express"
import validator from 'express-validator'

import validation from '../middleware/validation.js'
import auth from '../middleware/auth.js'

import createPost from "../controllers/posts/createPost.js"
import getPosts from '../controllers/posts/getPosts.js'


const router = new express.Router()

router.post(
  '/',  
  [
    validator.body('caption')
      .exists().withMessage('no caption provided').bail()
      .isString().withMessage('caption must be string').trim().bail()
      .notEmpty().withMessage('empty caption').bail()
      .isLength({ min: 1 }).withMessage('too short').bail()
      .isLength({ max: 2000 }).withMessage('too long').bail()
    ,
    validator.body('imageUrl')
      .exists().withMessage('no url provided').bail()
      .isString().withMessage('url must be string').trim().bail()
      .notEmpty().withMessage('empty url').bail()
    ,
  ],
  [validation, auth],
  createPost
)

router.get(
  '/', 
  [
    validator.query('limit')
      .toInt()
    ,
    validator.query('exclude').customSanitizer((v) => {
      try {
        return JSON.parse(v)
      } catch (e) {
        return null
      }
    })
  ],
  [auth, validation],
  getPosts
)

export default router
