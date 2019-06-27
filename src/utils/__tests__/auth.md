# Testing Pure Functions

## Background

Here's what a Jest test looks like:

```javascript
// add.js
export default (a, b) => a + b

// __tests__/add.js
import add from '../add'

test('add returns the sum of the two given numbers', () => {
  const result = add(1, 2)
  expect(result).toBe(3)
})
```

The `test` and `expect` functions are global variables provided to us from Jest.
(📜 find all the global variables here: https://jestjs.io/docs/en/api).

`expect` is an assertion library that's built into Jest and has a lot of
assertions you can use: (📜 find out about those assertions here:
https://jestjs.io/docs/en/expect, 🦉 you may want to keep that page open for
reference).

A "pure function" is a function with the following properties:

1. Its return value is the same for the same arguments (no variation with local
   static variables, non-local variables, mutable reference arguments or input
   streams from I/O devices).
2. Its evaluation has no side effects (no mutation of local static variables,
   non-local variables, mutable reference arguments or I/O streams).

> 📜 Read more on wikipedia: https://en.wikipedia.org/wiki/Pure_function

Thanks to these properties, pure functions are typically the easiest thing to
test. And because of _this_, it's often advisable to place as much of your
complex logic in pure functions as possible. That way you can write tests for
that logic very easily, giving you confidence that it continues to work as
intended over time.

## Exercise

In this exercise, we have a `isPasswordAllowed` function we can call with a
string and it returns `true` or `false` based on whether that password is strong
enough. The implementation of `isPasswordAllowed` enforces that the password is
at least 6 characters long and has at least one of the following characters:

1. non-alphanumeric
2. digit
3. uppercase letter
4. lowercase letter

For us to be confident that `isPasswordAllowed` will continue to function as
expected, we should have a test case for each of these (as well as one which
does pass the requirements).

Your job is to completely test the `isPasswordAllowed` function in
`src/utils/__tests__/auth.exercise.js`.

## Extra Credit

### 💯 reduce duplication

Depending on how this is solved we could have one of two problems:

1. We have an individual test for every assertion: This results in a lot of
   duplication, which can lead to typo mistakes
2. We have one giant test: This results in less helpful error messages.

See if you can figure out a way to programmatically generate the tests (using
arrays/loops) so we get both good error messages as well as avoiding
duplication.

### 💯 jest-in-case

Unfortunately for these generated tests, the error messages may still not be
quite what we're looking for. In addition, we may actually be writing more code
for this abstraction than before. So instead, let's use a module called
`jest-in-case` to test this.

📜 https://github.com/atlassian/jest-in-case

If I were to use `jest-in-case` for the `add` function as above, it would look
like this:

```javascript
import cases from 'jest-in-case'

cases(
  'add',
  opts => {
    const result = add(opts.a, opts.b)
    expect(result).toBe(opts.result)
  },
  {
    'sum of the two given numbers': {
      a: 1,
      b: 2,
      result: 3,
    },
  },
)
```

Clearly using `jest-in-case` for this simple function is going a bit overboard,
but doing this kind of thing for more complex pure functions with lots of cases
can simplify maintenance big time.

Here's an example of an open source project where I applied this similar kind of
pattern (before `jest-in-case` was a thing):
[`rtl-css-js` tests](https://github.com/kentcdodds/rtl-css-js/blob/25cb86e411c0c0177307bbf66246740c4d5e5adf/src/__tests__/index.js).
And here's another:
[`match-sorter` tests](https://github.com/kentcdodds/match-sorter/blob/master/src/__tests__/index.js)
(also wrote this before `jest-in-case` was a thing).

I've been the maintainer of these projects for years and people have commented
on how easy it is to contribute to because the tests are so easy to add to, and
once you've added a test case, you can go implement that feature easily. This is
a perfect tool for Test-Driven Development.

> Note, as mentioned, both of these were written before `jest-in-case` was
> created and I haven't taken the time to upgrade them. If I were actively
> working on these projects then I would definitely migrate them. I have
> definitely used `jest-in-case` in products I've worked on and I love it.

### 💯 improved titles for jest-in-case

The naive implementation of `jest-in-case` here may result in good, but still
imperfect test names which has an impact on the error messages you'll get. Try
to make it so the test name includes not only the reason a given password is
valid/invalid, but also what the password is.

## 🦉 Elaboration & Feedback

After the instruction, copy the URL below into your browser:
http://ws.kcd.im/?ws=Testing%20Node%20Apps&e=Testing%20Pure%20Functions&em=
