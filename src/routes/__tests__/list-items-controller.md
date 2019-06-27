# Testing Controllers

## Background

The term "controllers" in this context is really just a collection of middleware
that applies some business logic specific to your domain. They can involve
really simple or incredibly complex business rules resulting in code that can be
fairly difficult to test. Often controller code will also interact with a
database or other services.

They are tested in basically the same way that a regular middleware is tested,
except because our controller middleware is interacting with the database we're
going to mock out those interactions. We'll do this for a few reasons:

1. Test speed: Database/Service interactions will make our tests run slower.
2. Test simplicity: Database/Service interactions will make our tests require
   more complex setup/teardown logic.
3. Test stability: Database/Service interactions will make our tests more flaky
   by relying on services that may be outside our control.

> 🦉 While we get benefits by mocking databases and services, it's wise to not
> forget what we're giving up. Read
> [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
> and [The Merits of Mocking](https://kentcdodds.com/blog/the-merits-of-mocking)
> for more info.

### Mocking with Jest

Jest's mocking capabilities are second to none. The API is pretty simple. At the
top of your test file (just below the imports), you add:

```javascript
jest.mock('../path-to/the-module')
```

And Jest will read that module and determine its exports and create an automatic
mock function for function that file exports. Any file that imports that module
will receive the mock from Jest instead of the actual implementation.

Here's a quick example:

```javascript
// get-user-repos.js
import * as github from './github'

async function getUserRepos(user) {
  const result = await github.getRepos(user.username)
  return result.data
}

export {getUserRepos}

// __tests__/get-user-repos.js
import {buildUser, buildRepo} from 'utils/generate'
import * as github from '../github'
import {getUserRepos} from '../get-user-repos'

jest.mock('../github')
// because we've mocked `../github.js`, any other file which imports it
// will get Jest's mocked version of that module which is basically:
// { getRepos: jest.fn() }
// so we can treat it like a mock function in our tests
// 📜 https://jestjs.io/docs/en/mock-function-api

beforeEach(() => {
  // this will make sure our tests start in a clean state, clearing all mock
  // functions so they don't have record of having been called before.
  // This is important for test isolation.
  // 📜 Related blog post: https://kentcdodds.com/blog/test-isolation-with-react
  jest.clearAllMocks()
})

test(`gets the user's repositories`, async () => {
  // learn more about `buildUser()` and `buildRepo()` in the next section
  // "Generating Test Data"
  const user = buildUser()

  const fakeRepos = [
    buildRepo({ownerId: user.id}),
    buildRepo({ownerId: user.id}),
  ]
  // 🦉 here's the important bit. Because getRepos is a Jest mock function,
  // we can tell Jest to make it return a promise that resolves with the
  // object that we want our code to use instead of calling the real function.
  github.getRepos.mockResolvedValueOnce({data: fakeRepos})

  const repos = await getUserRepos(user)

  // because we're mocking getRepos, we want to make sure that it's being
  // called properly, so we'll add some assertions for that.
  expect(github.getRepos).toHaveBeenCalledTimes(1)
  expect(github.getRepos).toHaveBeenCalledWith(user.username)

  expect(repos).toEqual(fakeRepos)
})
```

The important bits above are the calls to `jest.mock` and
`mockResolvedValueOnce`. This is all you need to know for the exercise.

`jest.mock` also allows a bit more customization of the mock that's created
which you can learn about from these docs 📜

- https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options
- https://jestjs.io/docs/en/manual-mocks
- https://jestjs.io/docs/en/bypassing-module-mocks

### Generating Test Data

We've talked about Test Object Factories, but this is a little different. In the
example test above you may have noticed the `buildUser()` and `buildRepo()`
function calls. These functions generate randomized data for the given type of
object. It's a way to communicate through code: "All that matters is that you're
passing a user to this function and the repos that come back should be owned by
that user." So it's not only nice from a DRY perspective, but also through a
communication through code perspective. And we definitely do this for our,
books, list items, and users in this project, so be on the lookout for that.

## Exercise

In this project, we have an abstraction over the database which comes in really
handy for our controller tests. Because we don't want to make actual database
calls, we can instead mock the database abstraction (don't worry, that
abstraction will get coverage in the router-level tests).

We need to mock the database so we don't make calls to it in our tests.

> 🦉 Note that we're using `express-async-errors` in this project. That means
> that we can use `async/await` in our middleware and we don't have to call
> `next`. So you can call the middleware function with and `await` in your test.

## Extra Credit

### 💯 Use `toMatchInlineSnapshot` for errors

[Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) is a way to write
and update assertions more easily. It's fantastic, but does have a number of
drawbacks (so
[learn to use it effectively](https://kentcdodds.com/blog/effective-snapshot-testing)).
One of my favorite places to use snapshot testing is for error messages. This is
because making an assertion that matches the error message usually involves
copy/paste and keeping that updated as things change is a bit of a pain. So
snapshot testing is perfect for that.

Here's a quick example of how you can use snapshot testing based on a similar
example that we had above:

```javascript
test(`rejects with an error if no username is provided`, async () => {
  const userWithoutAUsername = {}
  const error = await getUserRepos(userWithoutAUsername).catch(err => err)

  // make sure that the getRepos mock was not called
  expect(github.getRepos).not.toHaveBeenCalled()

  expect(error.message).toMatchInlineSnapshot()
})
```

Here's the cool thing. The first time that runs, Jest will _update your code_ to
include a serialized version of `error.message`!

```javascript
expect(error.message).toMatchInlineSnapshot(`"No username provided"`)
```

> 🔥 NOTE: If you're using codesandbox to go through this, the code update will
> not appear automatically, but it has happened! Just close and re-open the file
> and you'll get the update.

I love this feature.

> Note, there's also `toMatchSnapshot` which places the snapshot in a separate
> file, but I much prefer the inline snapshots because it encourages me to keep
> the snapshots as small as possible and avoid one of the pitfalls with using
> snapshot testing.

In this extra credit, create and implement a test called:
`createListItem returns a 400 error if no bookId is provided`

And use a snapshot assertion on `res.json.mock.calls[0]`

> 📜 what is this `.mock.calls` thing?
> https://jestjs.io/docs/en/mock-function-api#mockfnmockcalls

### 💯 Test everything else

This controller has quite a few middleware and branches within those middleware
that you can test. See how much of it you can get covered.

You'll need to mock `../../db/list-items` and import it for a few of the tests,
so watch out for that.

## 🦉 Elaboration & Feedback

After the instruction, copy the URL below into your browser:
http://ws.kcd.im/?ws=Testing%20Node%20Apps&e=Testing%20Controllers&em=
