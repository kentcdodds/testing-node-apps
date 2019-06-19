import _ from 'lodash'
import {generateUUID} from './utils'

let users = []

async function query(queryObj) {
  return _.filter(users, queryObj)
}

async function readById(id) {
  return query({id})[0]
}

function readByUsername(username) {
  return query({username})[0]
}

async function insertMany(manyUsers) {
  users = [...users, ...manyUsers]
}

async function insert(user) {
  users = [...users, {id: generateUUID(), ...user}]
}

export {readById, readByUsername, insertMany, insert, query}

/* eslint require-await:0 */
