import _ from 'lodash'
import * as booksDB from '../../src/db/books'
import * as usersDB from '../../src/db/users'
import * as listItemsDB from '../../src/db/list-items'
import {getUserToken} from '../../src/utils/auth'
import * as generate from './generate'

async function initDb({
  books = Array.from({length: 100}, () => generate.buildBook()),
  users = Array.from({length: 10}, () => generate.buildUser()),
  listItems = _.flatten(
    users.map(u =>
      Array.from({length: Math.floor(Math.random() * 4)}, () =>
        generate.buildListItem({ownerId: u.id, bookId: random(books).id}),
      ),
    ),
  ),
} = {}) {
  await Promise.all([
    booksDB.insertMany(books),
    usersDB.insertMany(users),
    listItemsDB.insertMany(listItems),
  ])
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
  return {...testUser, token: getUserToken(testUser)}
}

function resetDb() {
  return initDb({books: [], users: [], listItems: []})
}

export {resetDb, initDb, insertTestUser, generate}
