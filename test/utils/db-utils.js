import * as booksDB from '../../src/server/db/books'
import * as usersDB from '../../src/server/db/users'
import * as listItemsDB from '../../src/server/db/list-items'
import * as generate from './generate'

async function initDb({
  books = Array.from({length: 100}, () => generate.buildBook()),
  users = Array.from({length: 10}, () => generate.buildUser()),
  listItems = users
    .map(u =>
      Array.from({length: Math.floor(Math.random() * 4)}, () =>
        generate.buildListItem({ownerId: u.id, bookId: random(books).id}),
      ),
    )
    .flat(),
} = {}) {
  await Promise.all(
    booksDB.insertMany(books),
    usersDB.insertMany(users),
    listItemsDB.insertMany(listItems),
  )
  return {books, users, listItems}
}

function random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

async function insertTestUser(
  testUser = generate.buildUser({
    username: 'joe',
    password: 'joe',
  }),
) {
  await usersDB.insert(testUser)
  return testUser
}

async function resetDb({books, users, listItems} = {}) {
  await initDb({books, users, listItems})
  return {books: booksDB}
}

export {resetDb, initDb, insertTestUser, generate}
