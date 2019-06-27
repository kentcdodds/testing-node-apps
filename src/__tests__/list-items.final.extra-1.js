// Testing CRUD API Routes
// 💯 snapshot the error message with dynamic data

import axios from 'axios'
import {resetDb, insertTestUser} from 'utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import startServer from '../start'

let baseURL, server

beforeAll(async () => {
  // Note: normally you'll want to keep your port base the same across all the tests
  // to avoid collisions. I'm setting this to 8400 because we actually do have collisions
  // in the files where I was teaching you that 😅
  server = await startServer({port: 8400 + Number(process.env.JEST_WORKER_ID)})
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server.close())

beforeEach(() => resetDb())

async function setup() {
  const testUser = await insertTestUser()
  const authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${testUser.token}`
  authAPI.interceptors.response.use(getData, handleRequestFailure)
  return {testUser, authAPI}
}

test('listItem CRUD', async () => {
  const {testUser, authAPI} = await setup()
  const book = generate.buildBook()
  await booksDB.insert(book)

  // CREATE
  const cData = await authAPI.post('list-items', {bookId: book.id})

  expect(cData.listItem).toMatchObject({
    ownerId: testUser.id,
    bookId: book.id,
  })
  const listItemId = cData.listItem.id
  const listItemIdUrl = `list-items/${listItemId}`

  // READ
  const rData = await authAPI.get(listItemIdUrl)
  expect(rData.listItem).toEqual(cData.listItem)

  // UPDATE
  const updates = {notes: generate.notes()}
  const uResult = await authAPI.put(listItemIdUrl, updates)
  expect(uResult.listItem).toEqual({...rData.listItem, ...updates})

  // DELETE
  const dData = await authAPI.delete(listItemIdUrl)
  expect(dData).toEqual({success: true})
  const error = await authAPI.get(listItemIdUrl).catch(resolve)
  expect(error.status).toBe(404)

  // because the ID is generated, we need to replace it in the error message
  // so our snapshot remains consistent
  const idlessMessage = error.data.message.replace(listItemId, 'LIST_ITEM_ID')
  expect(idlessMessage).toMatchInlineSnapshot(
    `"No list item was found with the id of LIST_ITEM_ID"`,
  )
})
