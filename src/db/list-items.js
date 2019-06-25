import _ from 'lodash'
import {generateUUID} from './utils'

let listItems = []

async function query(queryObj) {
  return _.filter(listItems, queryObj)
}

async function create(listItemData) {
  const {bookId, ownerId} = listItemData
  if (!bookId) {
    throw new Error(`New listItems must have a bookId`)
  }
  if (!ownerId) {
    throw new Error(`New listItems must have an ownerId`)
  }

  const newListItem = {
    id: generateUUID(),
    rating: -1,
    notes: '',
    finishDate: null,
    startDate: Date.now(),
    ...listItemData,
  }
  listItems = [...listItems, newListItem]
  return newListItem
}

async function readById(id) {
  return _.find(listItems, {id})
}

async function update(listItemId, updates) {
  const listItem = await readById(listItemId)
  if (!listItem) {
    return null
  }
  const updatedListItem = {
    ...listItem,
    ...updates,
  }
  listItems[listItems.indexOf(listItem)] = updatedListItem
  return updatedListItem
}

async function remove(id) {
  listItems = listItems.filter(li => li.id !== id)
}

async function insertMany(manyListItems) {
  listItems = [...listItems, ...manyListItems]
}

export {query, create, readById, update, remove, insertMany}

/* eslint require-await:0 */
