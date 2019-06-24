import crypto from 'crypto'
import expressJWT from 'express-jwt'
import LocalStrategy from 'passport-local'
import {omit} from 'lodash'
import jwt from 'jsonwebtoken'
import * as usersDB from '../db/users'

const secret = 'secret'

const iterations = process.env.NODE_ENV === 'production' ? 100000 : 1

// seconds/minute * minutes/hour * hours/day * 60 days
const sixtyDaysInSeconds = 60 * 60 * 24 * 60
// to keep our tests reliable, we'll use the requireTime if we're not in production
// and we'll use Date.now() if we are.
const requireTime = Date.now()
const now = () =>
  process.env.NODE_ENV === 'production' ? Date.now() : requireTime

function getSaltAndHash(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 512, 'sha512')
    .toString('hex')
  return {salt, hash}
}

function isPasswordValid(password, {salt, hash}) {
  return (
    hash ===
    crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('hex')
  )
}

function getUserToken({id, username}) {
  const issuedAt = Math.floor(now() / 1000)
  return jwt.sign(
    {
      id,
      username,
      iat: issuedAt,
      exp: issuedAt + sixtyDaysInSeconds,
    },
    secret,
  )
}

const authMiddleware = {
  required: expressJWT({
    secret,
  }),
  optional: expressJWT({
    secret,
    credentialsRequired: false,
  }),
}

function getLocalStrategy() {
  return new LocalStrategy(async (username, password, done) => {
    let user
    try {
      user = await usersDB.readByUsername(username)
    } catch (error) {
      return done(error)
    }
    if (!user || !isPasswordValid(password, user)) {
      return done(null, false, {
        errors: {'username or password': 'is invalid'},
      })
    }
    return done(null, userToJSON(user))
  })
}

function userToJSON(user) {
  return omit(user, ['exp', 'iat', 'hash', 'salt'])
}

function isPasswordAllowed(password) {
  return (
    password.length > 6 &&
    // non-alphanumeric
    /\W/.test(password) &&
    // digit
    /\d/.test(password) &&
    // capital letter
    /[A-Z]/.test(password) &&
    // lowercase letter
    /[a-z]/.test(password)
  )
}

export {
  authMiddleware,
  getSaltAndHash,
  userToJSON,
  getLocalStrategy,
  getUserToken,
  isPasswordAllowed,
}
