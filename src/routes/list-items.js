import express from 'express'
import {authMiddleware} from '../utils/auth'
import * as listItemsController from '../controllers/list-items'

function getListItemsRoutes() {
  const router = express.Router()

  router.get('/', authMiddleware.required, listItemsController.getListItems)
  router.get(
    '/:id',
    authMiddleware.required,
    listItemsController.setListItem,
    listItemsController.getListItem,
  )
  router.post('/', authMiddleware.required, listItemsController.createListItem)

  router.put(
    '/:id',
    authMiddleware.required,
    listItemsController.setListItem,
    listItemsController.updateListItem,
  )

  router.delete(
    '/:id',
    authMiddleware.required,
    listItemsController.setListItem,
    listItemsController.deleteListItem,
  )

  return router
}

export default getListItemsRoutes
