// Testing Middleware
// 💯 write a test object factory

import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

function buildRes(overrides) {
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    ...overrides,
  }
  return res
}

test('responds with 401 for express-jwt UnauthorizedError', () => {
  const req = {}
  const res = buildRes()
  const next = jest.fn()
  const code = 'fake_code'
  const message = 'Fake Error Message'
  const error = new UnauthorizedError(code, {message})
  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    code: error.code,
    message: error.message,
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('calls next if headersSent is true', () => {
  const req = {}
  const res = buildRes({headersSent: true})
  const next = jest.fn()
  const error = new Error('blah')
  errorMiddleware(error, req, res, next)
  expect(next).toHaveBeenCalledWith(error)
  expect(res.status).not.toHaveBeenCalled()
  expect(res.json).not.toHaveBeenCalled()
})

test('responds with 500 and the error object', () => {
  const req = {}
  const res = buildRes()
  const next = jest.fn()
  const error = new Error('blah')
  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(500)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: expect.any(String),
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})
