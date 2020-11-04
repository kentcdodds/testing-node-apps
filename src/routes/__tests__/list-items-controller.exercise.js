// Testing Controllers

// 🐨 you'll need a few of the generaters from test/utils/generate.js
// 💰 remember, you can import files in the test/utils directory as if they're node_modules
// 💰 import * as generate from 'utils/generate'

// 🐨 getListItem calls `expandBookData` which calls `booksDB.readById`
// so you'll need to import the booksDB from '../../db/books'
// 💰 import * as booksDB from '../../db/books'

// 🐨 don't forget to import the listItemsController from '../list-items-controller'
// here, that's the thing we're testing afterall :)
// 💰 import * as listItemsController from '../list-items-controller'

// 🐨 use jest.mock to mock '../../db/books' because we don't actually want to make
// database calls in this test file.

// 🐨 ensure that all mock functions have their call history cleared using
// jest.resetAllMocks here as in the example.

test('getListItem returns the req.listItem', async () => {
  // 🐨 create a user
  //
  // 🐨 create a book
  //
  // 🐨 create a listItem that has the user as the owner and the book
  // 💰 const listItem = buildListItem({ownerId: user.id, bookId: book.id})
  //
  // 🐨 mock booksDB.readById to resolve to the book
  // 💰 use mockResolvedValueOnce
  //
  // 🐨 make a request object that has properties for the user and listItem
  // 💰 checkout the implementation of getListItem in ../list-items-controller
  // to see how the request object is used and what properties it needs.
  // 💰 and you can use buildReq from utils/generate
  //
  // 🐨 make a response object
  // 💰 just use buildRes from utils/generate
  //
  // 🐨 make a call to getListItem with the req and res (`await` the result)
  //
  // 🐨 assert that booksDB.readById was called correctly
  //
  //🐨 assert that res.json was called correctly
})
