// Testing CRUD API Routes

import axios from 'axios'
import {resetDb, insertTestUser} from 'utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import startServer from '../start'

let baseURL

beforeAll(async () => {
  const server = await startServer()
  baseURL = `http://localhost:${server.address().port}/api`

  afterAll(() => server.close())
})

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
  expect(error.data).toEqual({
    message: expect.stringContaining('No list item was found with the id of'),
  })
})
