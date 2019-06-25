import * as listItemsDB from '../db/list-items'
import * as booksDB from '../db/books'

async function setListItem(req, res, next) {
  const {id} = req.params
  const listItem = await listItemsDB.readById(id)
  if (!listItem) {
    res
      .status(404)
      .json({message: `No list item was found with the id of ${id}`})
    return
  }
  if (req.user.id === listItem.ownerId) {
    req.listItem = listItem
    next()
  } else {
    res.status(403).json({
      message: `User with id ${req.user.id} is not authorized to access the list item ${id}`,
    })
  }
}

async function getListItems(req, res) {
  const listItems = await listItemsDB.query({ownerId: req.user.id})
  res.json({listItems: await expandBookDataMultiple(listItems)})
}

async function getListItem(req, res) {
  res.json({listItem: await expandBookData(req.listItem)})
}

async function createListItem(req, res) {
  const {
    user: {id: ownerId},
  } = req
  const {bookId} = req.body
  if (!bookId) {
    res.status(400).json({message: `No bookId provided`})
    return
  }
  const [existingListItem] = await listItemsDB.query({ownerId, bookId})
  if (existingListItem) {
    res.status(400).json({
      message: `User ${ownerId} already has a list item for the book with the ID ${bookId}`,
    })
    return
  }

  const listItem = await listItemsDB.create({ownerId, bookId})
  res.json({listItem: await expandBookData(listItem)})
}

async function updateListItem(req, res) {
  const updatedListItem = await listItemsDB.update(req.listItem.id, req.body)
  res.json({listItem: await expandBookData(updatedListItem)})
}

async function deleteListItem(req, res) {
  await listItemsDB.remove(req.listItem.id)
  res.json({success: true})
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
  setListItem,
  getListItems,
  getListItem,
  createListItem,
  updateListItem,
  deleteListItem,
}
