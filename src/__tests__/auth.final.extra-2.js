// Testing Authentication API Routes
// 💯 Ensure a unique server port

import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import {getData, handleRequestFailure} from 'utils/async'
import startServer from '../start'

let api, server

beforeAll(async () => {
  server = await startServer()
  const baseURL = `http://localhost:${server.address().port}/api`
  api = axios.create({baseURL})
  api.interceptors.response.use(getData, handleRequestFailure)
})

afterAll(() => server.close())

beforeEach(() => resetDb())

test('auth flow', async () => {
  const {username, password} = generate.loginForm()

  // register
  const rData = await api.post('auth/register', {username, password})
  expect(rData.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  // login
  const lData = await api.post('auth/login', {username, password})
  expect(lData.user).toEqual(rData.user)

  // authenticated request
  const mData = await api.get('auth/me', {
    headers: {
      Authorization: `Bearer ${lData.user.token}`,
    },
  })
  expect(mData.user).toEqual(lData.user)
})
