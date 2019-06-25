import {buildUser} from './generate'

function getReq({user = buildUser(), ...overrides} = {}) {
  const req = {user, body: {}, params: {}, ...overrides}
  return req
}

function getRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    ...overrides,
  }
  return res
}

function getNext(impl) {
  return jest.fn(impl)
}

export {getReq, getRes, getNext}
