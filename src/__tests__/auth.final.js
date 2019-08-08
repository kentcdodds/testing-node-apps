// Testing Authentication API Routes

import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'

beforeAll(async () => {
  const server = await startServer({port: 8000})
  afterAll(() => server.close())
})

beforeEach(() => resetDb())

test('auth flow', async () => {
  const {username, password} = generate.loginForm()

  // register
  const rResult = await axios.post('http://localhost:8000/api/auth/register', {
    username,
    password,
  })
  expect(rResult.data.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  // login
  const lResult = await axios.post('http://localhost:8000/api/auth/login', {
    username,
    password,
  })
  expect(lResult.data.user).toEqual(rResult.data.user)

  // authenticated request
  const mResult = await axios.get('http://localhost:8000/api/auth/me', {
    headers: {
      Authorization: `Bearer ${lResult.data.user.token}`,
    },
  })
  expect(mResult.data.user).toEqual(lResult.data.user)
})
