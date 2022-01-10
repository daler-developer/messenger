import express from 'express'
import validator from 'express-validator'

import validation from '../middleware/validation.js'
import login from '../controllers/users/login.js'
import register from '../controllers/users/register.js'
import loginWithToken from '../controllers/users/loginWithToken.js'
import getUser from '../controllers/users/getUser.js'
import getUsers from '../controllers/users/getUsers.js'
import auth from '../middleware/auth.js'
import updateUser from '../controllers/users/updateUser.js'


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
    ,
    validator.body('displayName')
      .exists().withMessage('no displayName provided').bail()
      .isString().withMessage('displayName must be string').trim().bail()
      .notEmpty().withMessage('empty displayName').bail()
      .isLength({ min: 6 }).withMessage('too short').bail()
      .isLength({ max: 15 }).withMessage('too long').bail()
  ],
  [
    validation
  ],
  register
)

router.get(
  '/:_id',
  [],
  getUser
)

router.get(
  '/',
  [auth],
  [
    validator.query('excludeCurrent')
      .if(validator.query('excludeCurrent').exists())
      .customSanitizer((v) => v === 'yes' ? true : false)
    ,
    validator.query('limit')
      .if(validator.query('limit').exists())
      .toInt()
    ,
    validator.query('exclude')
      .if(validator.query('exclude').exists())
      .customSanitizer((v) => {
        return JSON.parse(v)
      })
  ],
  getUsers
)

router.put(
  '/:_id',
  [auth],
  [
    
  ],
  [validation],
  updateUser
)

export default router
