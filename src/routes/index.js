import express from 'express'
import getAuthRouter from './auth'
import getListItemsRoutes from './list-items'

function getRouter() {
  const router = express.Router()
  router.use('/auth', getAuthRouter())
  router.use('/list-items', getListItemsRoutes())
  return router
}

export default getRouter
