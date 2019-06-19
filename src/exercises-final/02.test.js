// Testing Controller modules

import faker from 'faker'
import {buildUser, buildBook, buildListItem} from 'utils/generate'
import * as listItemController from '../02'
import * as listItemsDB from '../server/db/list-items'
import * as booksDB from '../server/db/books'

jest.mock('../server/db/list-items')
jest.mock('../server/db/books')

beforeEach(() => {
  jest.clearAllMocks()
})

test(`getUserListItems returns a user's list items`, async () => {
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

  const listItems = await listItemController.getUserListItems({user})

  expect(booksDB.readManyById).toHaveBeenCalledTimes(1)
  expect(booksDB.readManyById).toHaveBeenCalledWith([
    userListItems[0].bookId,
    userListItems[1].bookId,
  ])
  expect(listItemsDB.query).toHaveBeenCalledWith({ownerId: user.id})
  expect(listItems).toMatchObject(userListItems)
  expect(listItems.map(li => li.book)).toEqual(books)
})

test('createListItem creates and returns a list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const createdListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.query.mockResolvedValueOnce(null)
  listItemsDB.create.mockResolvedValueOnce(createdListItem)
  booksDB.readById.mockResolvedValueOnce(book)

  const listItem = await listItemController.createListItem({
    user,
    bookId: book.id,
  })

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

  expect(listItem).toMatchObject(createdListItem)
  expect(listItem.book).toEqual(book)
})

test('createListItem throws an error if the user already has a list item for the given book', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const book = buildBook({id: 'FAKE_BOOK_ID'})
  const existingListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.query.mockResolvedValueOnce(existingListItem)

  const error = await listItemController
    .createListItem({
      user,
      bookId: book.id,
    })
    .catch(e => e)

  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })

  expect(error.message).toMatchInlineSnapshot(
    `"User FAKE_USER_ID already has a list item for the book with the ID FAKE_BOOK_ID"`,
  )
})

test('updateListItem updates an existing list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})
  const updates = {notes: faker.lorem.paragraph()}

  const mergedListItemAndUpdates = {...listItem, ...updates}

  listItemsDB.readById.mockResolvedValueOnce(listItem)
  listItemsDB.update.mockResolvedValueOnce(mergedListItemAndUpdates)
  booksDB.readById.mockResolvedValueOnce(book)
  const updatedListItem = await listItemController.updateListItem({
    user,
    listItemId: listItem.id,
    updates,
  })

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)

  expect(listItemsDB.update).toHaveBeenCalledTimes(1)
  expect(listItemsDB.update).toHaveBeenCalledWith(listItem.id, updates)

  expect(booksDB.readById).toHaveBeenCalledTimes(1)
  expect(booksDB.readById).toHaveBeenCalledWith(book.id)

  expect(updatedListItem).toMatchObject(mergedListItemAndUpdates)
  expect(updatedListItem.book).toEqual(book)
})

test('updateListItem prevents a non-owner updating a list-item', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const listItem = buildListItem({
    id: 'FAKE_LIST_ITEM_ID',
    ownerId: 'something else',
  })

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const error = await listItemController
    .updateListItem({
      user,
      listItemId: listItem.id,
      updates: {},
    })
    .catch(e => e)

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)

  expect(listItemsDB.update).not.toHaveBeenCalled()

  expect(error.message).toMatchInlineSnapshot(
    `"User FAKE_USER_ID is not authorized to update the list item with the ID FAKE_LIST_ITEM_ID"`,
  )
})

test('deleteListItem deletes an existing list item', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})
  listItemsDB.readById.mockResolvedValueOnce(listItem)
  listItemsDB.remove.mockResolvedValueOnce()

  await listItemController.deleteListItem({user, listItemId: listItem.id})

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)

  expect(listItemsDB.remove).toHaveBeenCalledTimes(1)
  expect(listItemsDB.remove).toHaveBeenCalledWith(listItem.id)
})

test('deleteListItem prevents a non-owner removing a list-item', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const listItem = buildListItem({
    id: 'FAKE_LIST_ITEM_ID',
    ownerId: 'something else',
  })

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const error = await listItemController
    .deleteListItem({user, listItemId: listItem.id})
    .catch(e => e)

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)

  expect(listItemsDB.remove).not.toHaveBeenCalled()

  expect(error.message).toMatchInlineSnapshot(
    `"User FAKE_USER_ID is not authorized to delete the list item with the ID FAKE_LIST_ITEM_ID"`,
  )
})
