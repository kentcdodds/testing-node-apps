import express from 'express'
import {authMiddleware} from '../utils/auth'
import * as authController from './auth-controller'

function getAuthRoutes() {
  const router = express.Router()

  router.post('/register', authController.register)
  router.post('/login', authController.login)
  router.get('/me', authMiddleware, authController.me)

  return router
}

export default getAuthRoutes
