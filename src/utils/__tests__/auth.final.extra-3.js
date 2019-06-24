// Unit Testing Pure Functions
// 💯 improved titles for jest-in-case

import cases from 'jest-in-case'
import {isPasswordAllowed} from '../auth'

function casify(obj) {
  return Object.entries(obj).map(([key, password]) => ({
    name: `${password} - ${key}`,
    password,
  }))
}

cases(
  'isPasswordAllowed: valid passwords',
  ({password}) => {
    expect(isPasswordAllowed(password)).toBe(true)
  },
  casify({'valid password': '!aBc123'}),
)

cases(
  'isPasswordAllowed: invalid passwords',
  ({password}) => {
    expect(isPasswordAllowed(password)).toBe(false)
  },
  casify({
    'too short': 'a2c!',
    'no letters': '123456!',
    'no numbers': 'ABCdef!',
    'no uppercase letters': 'abc123!',
    'no lowercase letters': 'ABC123!',
    'no non-alphanumeric characters': 'ABCdef123',
  }),
)
