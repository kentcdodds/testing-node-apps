import _ from 'lodash'

let books = []

async function query(queryObj) {
  return _.filter(books, queryObj)
}

async function readById(id) {
  return _.find(books, {id})
}

async function readManyById(ids) {
  return _.filter(books, b => ids.includes(b.id))
}

async function insertMany(manyBooks) {
  books = [...books, ...manyBooks]
}

async function insert(book) {
  books = [...books, book]
}

async function drop() {
  books = []
}

export {readById, readManyById, insertMany, query, insert, drop}

/* eslint require-await:0 */
