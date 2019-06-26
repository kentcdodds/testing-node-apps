import {buildUser} from './generate'

function getReq({user = buildUser(), ...overrides} = {}) {
  const req = {user, body: {}, params: {}, ...overrides}
  return req
}

function getRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  }
  return res
}

function getNext(impl) {
  return jest.fn(impl).mockName('next')
}

export {getReq, getRes, getNext}
