import axios from 'axios'
import faker from 'faker'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import {getUserToken} from '../utils/auth'
import startServer from '../start'

const getData = res => res.data
const getError = error => error.response

let baseURL, authAPI, server, testUser

beforeAll(async () => {
  server = await startServer({port: 8000 + Number(process.env.JEST_WORKER_ID)})
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server.close())

beforeEach(async () => {
  testUser = generate.buildUser({id: generate.id()})
  await resetDb({testUser})
  const token = getUserToken(testUser)
  authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${token}`
})

test('listItem CRUD', async () => {
  const book = generate.buildBook()
  await booksDB.insert(book)

  // CREATE
  const cResult = await authAPI
    .post('list-items', {bookId: book.id})
    .then(getData)
  expect(cResult.listItem).toMatchObject({
    ownerId: testUser.id,
    bookId: book.id,
  })
  const listItemIdUrl = `list-items/${cResult.listItem.id}`

  // READ
  const rResult = await authAPI.get(listItemIdUrl).then(getData)
  expect(rResult.listItem).toEqual(cResult.listItem)

  // UPDATE
  const updates = {notes: faker.lorem.paragraph()}
  const uResult = await authAPI.put(listItemIdUrl, updates).then(getData)
  expect(uResult.listItem).toEqual({...rResult.listItem, ...updates})

  // DELETE
  const dResult = await authAPI.delete(listItemIdUrl).then(getData)
  expect(dResult).toEqual({success: true})
  const error = await authAPI.get(listItemIdUrl).catch(getError)
  expect(error.status).toBe(404) // it's no longer available
})
