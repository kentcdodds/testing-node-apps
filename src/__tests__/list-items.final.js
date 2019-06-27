import axios from 'axios'
import faker from 'faker'
import {resetDb} from 'utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import {getUserToken} from '../utils/auth'
import startServer from '../start'

let baseURL, server

beforeAll(async () => {
  server = await startServer({port: 8000 + Number(process.env.JEST_WORKER_ID)})
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server.close())

async function setup() {
  const testUser = generate.buildUser({id: generate.id()})
  await resetDb({testUser})
  const token = getUserToken(testUser)
  const authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${token}`
  authAPI.interceptors.response.use(getData, handleRequestFailure)
  return {testUser, authAPI}
}

test('listItem CRUD', async () => {
  const {testUser, authAPI} = await setup()
  const book = generate.buildBook()
  await booksDB.insert(book)

  // CREATE
  const cResult = await authAPI.post('list-items', {bookId: book.id})

  expect(cResult.listItem).toMatchObject({
    ownerId: testUser.id,
    bookId: book.id,
  })
  const listItemId = cResult.listItem.id
  const listItemIdUrl = `list-items/${listItemId}`

  // READ
  const rData = await authAPI.get(listItemIdUrl)
  expect(rData.listItem).toEqual(cResult.listItem)

  // UPDATE
  const updates = {notes: faker.lorem.paragraph()}
  const uResult = await authAPI.put(listItemIdUrl, updates)
  expect(uResult.listItem).toEqual({...rData.listItem, ...updates})

  // DELETE
  const dResult = await authAPI.delete(listItemIdUrl)
  expect(dResult).toEqual({success: true})
  const error = await authAPI.get(listItemIdUrl).catch(resolve)
  expect(error.status).toBe(404)
  expect(error.data).toEqual({
    message: expect.stringContaining('No list item was found with the id of'),
  })

  // because the ID is generated, we need to replace it in the error message
  // so our snapshot remains consistent
  const idlessMessage = error.data.message.replace(listItemId, 'LIST_ITEM_ID')
  expect(idlessMessage).toMatchInlineSnapshot(
    `"No list item was found with the id of LIST_ITEM_ID"`,
  )
})
