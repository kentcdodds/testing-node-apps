// Test Middleware

import {getRes, getReq, getNext} from 'utils/middleware'
import errorMiddleware from '../error-middleware'

test('responds with 500 and the error object', () => {
  const req = getReq()
  const res = getRes()
  const next = getNext()
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
  const req = getReq()
  const res = getRes({headersSent: true})
  const next = getNext()
  const error = new Error('blah')
  errorMiddleware(error, req, res, next)
  expect(next).toHaveBeenCalledWith(error)
  expect(res.json).not.toHaveBeenCalled()
})
