import * as listItemsDB from '../db/list-items'
import * as booksDB from '../db/books'

async function authorize(req, res, next) {
  const {ownerId} = await listItemsDB.readById(req.params.id)
  if (req.user.id === ownerId) {
    return next()
  } else {
    return res.status(403).json({
      message: `User with id ${req.user.id} is not authorized to manage the list item ${req.params.id}`,
    })
  }
}

async function getListItems(req, res) {
  const listItems = await listItemsDB.query({ownerId: req.user.id})
  return res.json({listItems: expandBookDataMultiple(listItems)})
}

async function getListItem(req, res) {
  const listItem = await listItemsDB.readById(req.params.id)
  if (listItem) {
    return res.json({listItem})
  } else {
    return res.status(404).json()
  }
}

async function createListItem(req, res) {
  const {
    user: {id: ownerId},
  } = req
  const {bookId} = req.body
  if (!bookId) {
    return res.status(400).json({message: `No bookId provided`})
  }
  const existingListItem = await listItemsDB.query({ownerId, bookId})
  if (existingListItem) {
    return res.status(400).json({
      message: `User ${ownerId} already has a list item for the book with the ID ${bookId}`,
    })
  }

  const listItem = await listItemsDB.create({ownerId, bookId})
  return res.json({listItem: expandBookData(listItem)})
}

async function updateListItem(req, res) {
  const updatedListItem = await listItemsDB.update(req.params.id, req.body)
  if (updatedListItem) {
    return res.json({listItem: expandBookData(updatedListItem)})
  } else {
    return res
      .status(404)
      .json({message: `There is no post with the id of ${req.params.id}`})
  }
}

async function deleteListItem(req, res) {
  const listItem = await listItemsDB.remove(req.params.id)
  return res.json({listItem})
}

async function expandBookData(listItem) {
  const book = await booksDB.readById(listItem.bookId)
  return {...listItem, book}
}

async function expandBookDataMultiple(listItems) {
  const books = await booksDB.readManyById(listItems.map(li => li.bookId))
  return listItems.map(listItem => ({
    ...listItem,
    book: books.find(book => book.id === listItem.bookId),
  }))
}

export {
  authorize,
  getListItems,
  getListItem,
  createListItem,
  updateListItem,
  deleteListItem,
}
