import express from 'express'
import getAuthRoutes from './auth'
import getListItemsRoutes from './list-items'

function getRouter() {
  const router = express.Router()
  router.use('/auth', getAuthRoutes())
  router.use('/list-items', getListItemsRoutes())
  return router
}

export default getRouter
