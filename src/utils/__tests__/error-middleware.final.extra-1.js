// Testing Middleware
// 💯 write a test object factory

import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

function getRes(overrides) {
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    ...overrides,
  }
  return res
}

test('responds with 401 for express-jwt UnauthorizedError', () => {
  const req = {}
  const res = getRes()
  const next = jest.fn()
  const code = 'fake_code'
  const message = 'Fake Error Message'
  const error = new UnauthorizedError(code, {message})
  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({code, message})
})

test('responds with 500 and the error object', () => {
  const req = {}
  const res = getRes()
  const next = jest.fn()
  const error = new Error('blah')
  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    message: 'blah',
    stack: expect.any(String),
  })
})

test('calls next if headersSent is true', () => {
  const req = {}
  const res = getRes({headersSent: true})
  const next = jest.fn()
  const error = new Error('blah')
  errorMiddleware(error, req, res, next)
  expect(next).toHaveBeenCalledWith(error)
  expect(res.json).not.toHaveBeenCalled()
})
