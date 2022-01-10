import express from 'express'
import validator from 'express-validator'

import validation from '../middleware/validation.js'
import login from '../controllers/users/login.js'
import register from '../controllers/users/register.js'
import loginWithToken from '../controllers/users/loginWithToken.js'


const router = new express.Router()

router.post(
  '/login-with-token',
  [
    validator.body('token')
      .exists().withMessage('no token provided').bail()
      .isString().withMessage('token must be string').trim().bail()
      .notEmpty().withMessage('empty token').bail()
  ], 
  loginWithToken
)

router.post(
  '/login',
  [
    validator.body('username')
      .exists().withMessage('no username provided').bail()
      .isString().withMessage('username must be string').trim().bail()
      .notEmpty().withMessage('empty username').bail()
      .isLength({ min: 3 }).withMessage('too short').bail()
      .isLength({ max: 15 }).withMessage('too long').bail()
    ,
    validator.body('password')
      .exists().withMessage('no password provided').bail()
      .isString().withMessage('password must be string').trim().bail()
      .notEmpty().withMessage('empty password').bail()
      .isLength({ min: 6 }).withMessage('too short').bail()
      .isLength({ max: 15 }).withMessage('too long').bail()
  ],
  login
)

router.post(
  '/register',
  [
    validator.body('username')
      .exists().withMessage('no username provided').bail()
      .isString().withMessage('username must be string').trim().bail()
      .notEmpty().withMessage('empty username').bail()
      .isLength({ min: 3 }).withMessage('too short').bail()
      .isLength({ max: 15 }).withMessage('too long').bail()
    ,
    validator.body('password')
      .exists().withMessage('no password provided').bail()
      .isString().withMessage('password must be string').trim().bail()
      .notEmpty().withMessage('empty password').bail()
      .isLength({ min: 6 }).withMessage('too short').bail()
      .isLength({ max: 15 }).withMessage('too long').bail()
  ],
  [
    validation
  ],
  register
)

export default router
