import faker from 'faker'
import {getUserToken, getSaltAndHash} from '../../src/utils/auth'

// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`
const getUsername = faker.internet.userName
const getId = faker.random.uuid

function buildUser({password = getPassword(), ...overrides} = {}) {
  return {
    id: getId(),
    username: getUsername(),
    ...getSaltAndHash(password),
    ...overrides,
  }
}

function buildBook(overrides) {
  return {
    id: getId(),
    title: faker.lorem.words(),
    author: faker.name.findName(),
    coverImageUrl: faker.image.imageUrl(),
    pageCount: faker.random.number(400),
    publisher: faker.company.companyName(),
    synopsis: faker.lorem.paragraph(),
    ...overrides,
  }
}

function buildListItem(overrides = {}) {
  const {
    bookId = overrides.book ? overrides.book.id : getId(),
    startDate = faker.date.past(2),
    finishDate = faker.date.between(startDate, new Date()),
    owner = {ownerId: getId()},
  } = overrides
  return {
    id: getId(),
    bookId,
    ownerId: owner.id,
    rating: faker.random.number(5),
    notes: faker.random.boolean() ? '' : faker.lorem.paragraph(),
    finishDate,
    startDate,
    ...overrides,
  }
}

function token(user) {
  return getUserToken(buildUser(user))
}

function loginForm(overrides) {
  return {
    username: getUsername(),
    password: getPassword(),
    ...overrides,
  }
}

export {
  buildUser,
  buildListItem,
  buildBook,
  token,
  loginForm,
  getPassword as password,
  getUsername as username,
  getId as id,
}
