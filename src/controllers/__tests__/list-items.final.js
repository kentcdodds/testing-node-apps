// Testing Controllers

import faker from 'faker'
import {buildUser, buildBook, buildListItem} from 'utils/generate'
import {getRes, getReq, getNext} from 'utils/middleware'
import * as listItemsDB from '../../db/list-items'
import * as booksDB from '../../db/books'
import * as listItemController from '../list-items'

jest.mock('../../db/list-items')
jest.mock('../../db/books')

beforeEach(() => {
  jest.clearAllMocks()
})

test('setListItem sets the listItem on the req', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = getReq({user, params: {id: listItem.id}})
  const res = getRes()
  const next = getNext()

  await listItemController.setListItem(req, res, next)

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)

  expect(next).toHaveBeenCalledTimes(1)

  expect(req.listItem).toBe(listItem)
})

test('setListItem returns a 404 error if the list item does not exist', async () => {
  listItemsDB.readById.mockResolvedValueOnce(null)

  const req = getReq({params: {id: 'FAKE_LIST_ITEM_ID'}})
  const res = getRes()

  await listItemController.setListItem(req, res)

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith('FAKE_LIST_ITEM_ID')

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No list item was found with the id of FAKE_LIST_ITEM_ID",
      },
    ]
  `)
})

test('setListItem returns a 403 error if the list item does not belong to the user', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const listItem = buildListItem({
    ownerId: 'SOMEONE_ELSE',
    id: 'FAKE_LIST_ITEM_ID',
  })

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = getReq({user, params: {id: listItem.id}})
  const res = getRes()

  await listItemController.setListItem(req, res)

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "User with id FAKE_USER_ID is not authorized to access the list item FAKE_LIST_ITEM_ID",
      },
    ]
  `)
})

test('getListItem returns the req.listItem', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})

  booksDB.readById.mockResolvedValueOnce(book)

  const req = getReq({user, listItem})
  const res = getRes()

  await listItemController.getListItem(req, res)

  expect(booksDB.readById).toHaveBeenCalledTimes(1)
  expect(booksDB.readById).toHaveBeenCalledWith(book.id)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    listItem: {...listItem, book},
  })
})

test(`getListItems returns a user's list items`, async () => {
  const user = buildUser()
  const books = [buildBook(), buildBook()]
  const userListItems = [
    buildListItem({
      ownerId: user.id,
      bookId: books[0].id,
    }),
    buildListItem({
      ownerId: user.id,
      bookId: books[1].id,
    }),
  ]
  booksDB.readManyById.mockResolvedValueOnce(books)
  listItemsDB.query.mockResolvedValueOnce(userListItems)

  const req = getReq({user})
  const res = getRes()

  await listItemController.getListItems(req, res)

  expect(booksDB.readManyById).toHaveBeenCalledTimes(1)
  expect(booksDB.readManyById).toHaveBeenCalledWith([
    userListItems[0].bookId,
    userListItems[1].bookId,
  ])
  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({ownerId: user.id})
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    listItems: [
      // the returned list items have the books expanded
      {...userListItems[0], book: books[0]},
      {...userListItems[1], book: books[1]},
    ],
  })
})

test('createListItem creates and returns a list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const createdListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.query.mockResolvedValueOnce([])
  listItemsDB.create.mockResolvedValueOnce(createdListItem)
  booksDB.readById.mockResolvedValueOnce(book)

  const req = getReq({user, body: {bookId: book.id}})
  const res = getRes()

  await listItemController.createListItem(req, res)

  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })

  expect(listItemsDB.create).toHaveBeenCalledTimes(1)
  expect(listItemsDB.create).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })

  expect(booksDB.readById).toHaveBeenCalledTimes(1)
  expect(booksDB.readById).toHaveBeenCalledWith(book.id)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({listItem: {...createdListItem, book}})
})

test('createListItem returns a 400 error if the user already has a list item for the given book', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const book = buildBook({id: 'FAKE_BOOK_ID'})
  const existingListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.query.mockResolvedValueOnce([existingListItem])

  const req = getReq({user, body: {bookId: book.id}})
  const res = getRes()

  await listItemController.createListItem(req, res)
  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "User FAKE_USER_ID already has a list item for the book with the ID FAKE_BOOK_ID",
      },
    ]
  `)
})

test('createListItem returns a 400 error if no bookId is provided', async () => {
  const req = getReq()
  const res = getRes()

  await listItemController.createListItem(req, res)

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
})

test('updateListItem updates an existing list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})
  const updates = {notes: faker.lorem.paragraph()}

  const mergedListItemAndUpdates = {...listItem, ...updates}

  listItemsDB.update.mockResolvedValueOnce(mergedListItemAndUpdates)
  booksDB.readById.mockResolvedValueOnce(book)

  const req = getReq({
    user,
    listItem,
    body: updates,
  })
  const res = getRes()

  await listItemController.updateListItem(req, res)

  expect(listItemsDB.update).toHaveBeenCalledTimes(1)
  expect(listItemsDB.update).toHaveBeenCalledWith(listItem.id, updates)

  expect(booksDB.readById).toHaveBeenCalledTimes(1)
  expect(booksDB.readById).toHaveBeenCalledWith(book.id)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    listItem: {...mergedListItemAndUpdates, book},
  })
})

test('deleteListItem deletes an existing list item', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})
  listItemsDB.remove.mockResolvedValueOnce()

  const req = getReq({
    user,
    listItem,
  })
  const res = getRes()

  await listItemController.deleteListItem(req, res)

  expect(listItemsDB.remove).toHaveBeenCalledTimes(1)
  expect(listItemsDB.remove).toHaveBeenCalledWith(listItem.id)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({success: true})
})
