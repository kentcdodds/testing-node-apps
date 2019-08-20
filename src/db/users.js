import _ from 'lodash'
import {generateUUID} from './utils'

let users = []

async function query(queryObj) {
  return _.filter(users, queryObj)
}

async function readById(id) {
  return query({id})[0]
}

async function readByUsername(username) {
  return (await query({username}))[0]
}

async function insertMany(manyUsers) {
  users = [...users, ...manyUsers]
}

async function insert(user) {
  const newUser = {id: generateUUID(), ...user}
  users = [...users, newUser]
  return newUser
}

async function drop() {
  users = []
}

export {readById, readByUsername, insertMany, insert, query, drop}

/* eslint require-await:0 */
