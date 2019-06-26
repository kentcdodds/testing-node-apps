import express from 'express'
import {authMiddleware} from '../utils/auth'
import * as listItemsController from './list-items-controller'

function getListItemsRoutes() {
  const router = express.Router()

  router.get('/', authMiddleware, listItemsController.getListItems)

  router.get(
    '/:id',
    authMiddleware,
    listItemsController.setListItem,
    listItemsController.getListItem,
  )

  router.post('/', authMiddleware, listItemsController.createListItem)

  router.put(
    '/:id',
    authMiddleware,
    listItemsController.setListItem,
    listItemsController.updateListItem,
  )

  router.delete(
    '/:id',
    authMiddleware,
    listItemsController.setListItem,
    listItemsController.deleteListItem,
  )

  return router
}

export default getListItemsRoutes
