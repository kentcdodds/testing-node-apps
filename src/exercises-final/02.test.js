import {buildUser, buildBook, buildListItem} from 'utils/generate'
import * as listItemController from '../02'
import * as listItemsDB from '../app/db/list-items'
import * as booksDB from '../app/db/books'

jest.mock('../app/db/list-items')
jest.mock('../app/db/books')

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
  listItemsDB.readManyBy.mockResolvedValueOnce(userListItems)

  const listItems = await listItemController.getUserListItems({user})

  expect(booksDB.readManyById).toHaveBeenCalledTimes(1)
  expect(booksDB.readManyById).toHaveBeenCalledWith([
    userListItems[0].bookId,
    userListItems[1].bookId,
  ])
  expect(listItemsDB.readManyBy).toHaveBeenCalledWith({ownerId: user.id})
  expect(listItems).toMatchObject(userListItems)
  expect(listItems.map(li => li.book)).toEqual(books)
})

test('createListItem creates and returns a list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const createdListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.readBy.mockResolvedValueOnce(null)
  listItemsDB.create.mockResolvedValueOnce(createdListItem)
  booksDB.readById.mockResolvedValueOnce(book)

  const listItem = await listItemController.createListItem({
    user,
    bookId: book.id,
  })

  expect(listItem).toMatchObject(createdListItem)
  expect(listItem.book).toEqual(book)
})

test('createListItem throws an error if the user already has a list item for the given book', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const book = buildBook({id: 'FAKE_BOOK_ID'})
  const existingListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.readBy.mockResolvedValueOnce(existingListItem)

  const error = await listItemController
    .createListItem({
      user,
      bookId: book.id,
    })
    .catch(e => e)

  expect(error.message).toMatchInlineSnapshot(
    `"User FAKE_USER_ID already has a list item for the book with the ID FAKE_BOOK_ID"`,
  )
})
