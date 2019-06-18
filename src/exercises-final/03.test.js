// Test Middleware

import jwt from 'jsonwebtoken'
import {buildUser} from 'utils/generate'
import * as usersDB from '../app/db/users'
import log from '../app/logging-service'
import {setUser} from '../03'

jest.mock('../app/logging-service')
jest.mock('../app/db/users')

const originalSecret = process.env.JWT_SECRET

beforeAll(() => {
  process.env.JWT_SECRET = 'test_jwt_secret'
})

afterAll(() => {
  process.env.JWT_SECRET = originalSecret
})

beforeEach(() => {
  jest.clearAllMocks()
})

function setup({token} = {}) {
  const headers = {Authorization: token ? `Bearer ${token}` : undefined}
  const req = {
    get: header => {
      if (headers.hasOwnProperty(header)) {
        return headers[header]
      }
      throw new Error(
        `The test does not support getting the header called ${header}`,
      )
    },
  }
  const res = {
    status: jest.fn(),
    end: jest.fn(),
  }
  return {req, res}
}

function assert401(req, res) {
  expect(req.user).toBeUndefined()
  expect(usersDB.readById).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.end).toHaveBeenCalledTimes(1)
}

test('sets the req.user property based on the token', async () => {
  const fakeUserId = 'FAKE_USER_ID'
  const fakeUser = buildUser({id: fakeUserId})
  const token = jwt.sign({userId: fakeUserId}, process.env.JWT_SECRET)
  const {req, res} = setup({token})
  usersDB.readById.mockResolvedValueOnce(fakeUser)

  await setUser(req, res)

  expect(req.user).toEqual(fakeUser)
  expect(usersDB.readById).toHaveBeenCalledTimes(1)
  expect(usersDB.readById).toHaveBeenCalledWith(fakeUserId)
})

test('responds with status 401 if there is no token', async () => {
  const {req, res} = setup()

  await setUser(req, res)

  assert401(req, res)
  expect(log).not.toHaveBeenCalled()
})

test('responds with status 401 for expired tokens', async () => {
  const token = jwt.sign({}, process.env.JWT_SECRET, {expiresIn: -1000})
  const {req, res} = setup({token})

  await setUser(req, res)

  assert401(req, res)
  expect(log).not.toHaveBeenCalled()
})

test('responds with status 401 for tokens which are used too soon', async () => {
  const fakeUserId = 'FAKE_USER_ID'
  const token = jwt.sign({userId: fakeUserId}, process.env.JWT_SECRET, {
    notBefore: 1000,
  })
  const {req, res} = setup({token})

  await setUser(req, res)

  assert401(req, res)
  expect(log).not.toHaveBeenCalled()
})

test('responds with status 401 for tokens which are invalid and logs', async () => {
  const token = 'invalid token'
  const {req, res} = setup({token})

  await setUser(req, res)

  assert401(req, res)
  expect(log.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "error": [JsonWebTokenError: jwt malformed],
          "token": "invalid token",
        },
      ],
    ]
  `)
})
