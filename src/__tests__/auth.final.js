import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import * as usersDB from '../db/users'
import {getUserToken} from '../utils/auth'
import startServer from '../start'

const getData = res => res.data
const getError = error => error.response
const getUser = res => res.data.user

let baseURL, api, authAPI, server, testUser

beforeAll(async () => {
  server = await startServer({port: 8000 + Number(process.env.JEST_WORKER_ID)})
  baseURL = `http://localhost:${server.address().port}/api`
  api = axios.create({baseURL})
})

afterAll(() => server.close())

beforeEach(async () => {
  testUser = generate.buildUser({id: generate.id()})
  await resetDb({testUser})
  const token = getUserToken(testUser)
  authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${token}`
})

test('get me', async () => {
  const {user} = await authAPI.get('auth/me').then(getData)
  expect({...testUser, token: generate.token(testUser)}).toMatchObject(user)
})

test('username required to register', async () => {
  const error = await api
    .post('auth/register', {password: generate.password()})
    .catch(getError)
  expect(error.status).toBe(400)
  expect(error.data).toMatchInlineSnapshot(`
    Object {
      "message": "username can't be blank",
    }
  `)
})

test('password required to register', async () => {
  const error = await api
    .post('auth/register', {username: generate.username()})
    .catch(getError)
  expect(error.status).toBe(400)
  expect(error.data).toMatchInlineSnapshot(`
    Object {
      "message": "password can't be blank",
    }
  `)
})

test('username required to login', async () => {
  const error = await api
    .post('auth/login', {password: generate.password()})
    .catch(getError)
  expect(error.status).toBe(400)
  expect(error.data).toMatchInlineSnapshot(`
    Object {
      "message": "username can't be blank",
    }
  `)
})

test('password required to login', async () => {
  const error = await api
    .post('auth/login', {username: generate.username()})
    .catch(getError)
  expect(error.status).toBe(400)
  expect(error.data).toMatchInlineSnapshot(`
    Object {
      "message": "password can't be blank",
    }
  `)
})

test('user must exist to login', async () => {
  const error = await api
    .post('auth/login', generate.loginForm({username: '__will_never_exist__'}))
    .catch(getError)
  expect(error).toMatchObject({
    status: 400,
    data: {errors: {'username or password': expect.any(String)}},
  })
  expect(error.data.errors).toMatchInlineSnapshot(`
    Object {
      "username or password": "is invalid",
    }
  `)
})

test('username must be unique', async () => {
  const username = generate.username()
  await usersDB.insert(generate.buildUser({username}))
  const error = await api
    .post('auth/register', {username, password: 'Nancy-is-#1'})
    .catch(getError)
  expect(error.status).toBe(400)
  expect(error.data).toMatchInlineSnapshot(`
    Object {
      "message": "username taken",
    }
  `)
})

test('successful login', async () => {
  const password = generate.password()
  const newTestUser = await usersDB.insert(generate.buildUser({password}))
  const user = await api
    .post('auth/login', {
      username: newTestUser.username,
      password,
    })
    .then(getUser)
  expect(user).toEqual({
    token: expect.any(String),
    id: newTestUser.id,
    username: newTestUser.username,
  })
})
